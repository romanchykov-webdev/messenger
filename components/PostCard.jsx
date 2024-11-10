import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Share} from 'react-native';
import {theme} from "../constants/theme";
import {formatDate, formatTime, hp, stripHtmlTags, wp} from "../helpers/common";
import Avatar from "./Avatar";
import Icon from "../assets/icons";

import {Image} from 'expo-image'

import {Video} from 'expo-av';

import RenderHtml from 'react-native-render-html';
import {downloadFile, getSupabaseFileUrl} from "../services/imagesService";
import {createPostLike, removePostLike} from "../services/postService";
import Loading from "./Loading";

const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75)
}
const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark,
    },
    h4: {
        color: theme.colors.dark,
    },
}

const PostCard = ({
                      item,
                      currentUser,
                      router,
                      hasShadow = true,
                      showMoreIcon = true,
                      showDelete = false,
                      onDelete = () => {
                      },
                      onEdit = () => {
                      }
                  }) => {

    const shadowStyle = {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    // get like for post
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(false) //for share post
    useEffect(() => {
        setLikes(item?.postLikes)
    }, [])

    // for format data
    // const createdAt = moment(item?.created_at).format('MMM D')


    //
    const liked = likes.filter(like => like.userId === currentUser?.id)[0] ? true : false;
    // const liked = likes?.some(like => like.userId === currentUser?.id) || false;
    // console.log('item?.user?.image',getSupabaseFileUrl(item?.user?.image))

    // add liks
    // const onLike = async () => {
    //
    //     if (liked) {
    //         // remove like
    //         let updateLikes = likes.filter(like => like.userId != currentUser?.id);
    //         setLikes([...updateLikes])
    //
    //         let res = await removePostLike(item?.id, currentUser?.id);
    //
    //         // console.log('remove like', res)
    //         // console.log('data',data)
    //
    //         if (!res.success) {
    //             Alert.alert('Post Like', 'Something went wrong!')
    //         }
    //     } else {
    //         //     add new like
    //         let data = {
    //             userId: currentUser?.id,
    //             postId: item?.id,
    //         }
    //         setLikes([...likes, data])
    //
    //         let res = await createPostLike(data)
    //
    //         // console.log('add like', res)
    //         // console.log('data',data)
    //
    //         if (!res.success) {
    //             Alert.alert('Post Like', 'Something went wrong!')
    //         }
    //     }
    //
    //
    // }

    const onLike = async () => {
        const userHasLiked = likes.some(like => like.userId === currentUser?.id);
        const updatedLikes = userHasLiked
            ? likes.filter(like => like.userId !== currentUser?.id)
            : [...likes, { userId: currentUser?.id, postId: item?.id }];

        setLikes(updatedLikes);

        const res = userHasLiked
            ? await removePostLike(item?.id, currentUser?.id)
            : await createPostLike({ userId: currentUser?.id, postId: item?.id });

        if (!res.success) {
            Alert.alert('Post Like', 'Something went wrong!');
        }
    };



    //
    // console.log('item post likes', item)

    // on share
    // const onShare = async () => {
    //     let content = {message: stripHtmlTags(item?.body)};
    //
    //     if (item?.file) {
    //         //     download the file the share the local uri
    //         let url = await downloadFile(getSupabaseFileUrl(item?.file).uri);
    //         content.url = url;
    //     }
    //
    //     Share.share(content);
    //
    // }
    const onShare = async () => {
        try {
            let content = {message: stripHtmlTags(item?.body)};

            if (item?.file) {
                // Загрузка файла и получение локального URI
                setLoading(true)
                const localUri = await downloadFile(getSupabaseFileUrl(item?.file));
                if (localUri) {
                    content.url = localUri;
                    setLoading(false)
                } else {
                    console.log("Ошибка при загрузке файла");
                }
            }

            await Share.share(content);

        } catch (error) {
            console.error("Ошибка при попытке поделиться постом:", error);
        }
    };

    // open post details
    const openPostDetails = () => {
        if (!showMoreIcon) return null;
        router.push({pathname: 'postDetails', params: {postId: item?.id}})
    }


    // for delete post
    const handleDeletePost=async ()=>{
        // onDelete
        Alert.alert('Delete', 'Are you sure you want to do this?', [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancel'),
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => onDelete(item),
                style: 'destructive'
            }
        ]);
    }

    // console.log('post item comment:',item?.comments)
    return (
        <View style={[styles.container, hasShadow && shadowStyle]}>

            {/*    header*/}
            <View style={[styles.header]}>

                {/*    user info*/}
                <View style={styles.userInfo}>
                    <Avatar
                        uri={item?.user?.image}
                        size={hp(4.5)}
                        rounded={theme.radius.md}
                    />
                    <View style={{gap: 2}}>
                        <Text style={styles.userName}>{item?.user?.name}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.postTime}>{formatDate(item?.created_at)} -</Text>
                            <Text style={styles.postTime}>{formatTime(item?.created_at)}</Text>
                        </View>

                    </View>
                </View>

                {/*    three dots*/}
                {
                    showMoreIcon && (
                        <TouchableOpacity onPress={openPostDetails}>
                            <Icon name='threeDotsHorizontal' size={hp(3.4)} color={theme.colors.text} strokeWidth={3}/>
                        </TouchableOpacity>
                    )
                }

            {/*    for delete or edit post*/}
                {
                    showDelete && currentUser.id ===item?.userId &&(
                        <View style={styles.actions}>

                        {/*    edit post*/}
                            <TouchableOpacity onPress={()=>onEdit(item)} style={styles.buttonED}>
                                <Icon name='edit' size={hp(2.5)} color={theme.colors.text} strokeWidth={3}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeletePost} style={styles.buttonED}>
                                <Icon name='delete' size={hp(2.5)} color={theme.colors.rose} strokeWidth={3}/>
                            </TouchableOpacity>
                        </View>
                    )
                }


            </View>

            {/*  post body and media  */}
            <View style={styles.content}>

                {/*    post body*/}
                <View style={styles.postBody}>
                    {
                        item?.body && (
                            <RenderHtml
                                source={{html: item?.body}}
                                contentWidth={wp(100)}
                                tagsStyles={tagsStyles}
                            />
                        )
                    }
                </View>

                {/*    block image to the post */}
                {
                    item?.file && item?.file?.includes('postImages') && (
                        <Image
                            source={getSupabaseFileUrl(item?.file)}
                            transition={100}
                            style={styles.postMedia}
                            contentFit='cover'
                        />
                    )
                }

                {/*   video to the post*/}
                {
                    item?.file && item?.file?.includes('postVideos') && (
                        <Video
                            style={[styles.postMedia, {height: hp(30)}]}
                            // source={getSupabaseFileUrl(item?.file)}
                            source={{uri: getSupabaseFileUrl(item?.file)}}
                            useNativeControls
                            resizeMode='cover'
                            isLooping
                        />
                    )
                }

                {/*    like and share*/}
                <View style={styles.footer}>

                    {/*licks*/}
                    <View style={styles.footerButton}>
                        <TouchableOpacity onPress={onLike} style={{padding: 2}}>
                            <Icon name='heart' fill={liked ? theme.colors.rose : 'transparent'} size={24}
                                  color={liked ? theme.colors.rose : theme.colors.textLight}/>
                        </TouchableOpacity>

                        <Text style={styles.count}>
                            {likes?.length}
                        </Text>

                    </View>

                    {/*comments*/}
                    <View style={styles.footerButton}>
                        <TouchableOpacity onPress={openPostDetails} style={{padding: 2}}>
                            <Icon name='comment' size={24} color={theme.colors.textLight}/>
                        </TouchableOpacity>

                        <Text style={styles.count}>
                            {item?.comments?.[0]?.count}
                        </Text>

                    </View>


                    {/*share post*/}
                    <View style={styles.footerButton}>
                        {
                            loading
                                ? (
                                    <Loading size="small"/>
                                )
                                : (
                                    <TouchableOpacity onPress={onShare} style={{padding: 2}}>
                                        <Icon name='share2' size={24} color={theme.colors.textLight}/>
                                    </TouchableOpacity>
                                )
                        }

                    </View>

                </View>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium
    },
    content: {
        gap: 10,
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    buttonED:{
        padding:10,
        backgroundColor: 'white',
        borderRadius:theme.radius.sm,
        borderWidth:0.5,
        borderColor:theme.colors.gray,
        // box shadow
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7

    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    }
})

export default PostCard;
