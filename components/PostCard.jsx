import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {theme} from "../constants/theme";
import {hp, wp} from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";

import {Image} from 'expo-image'

import {Video} from 'expo-av';

import RenderHtml from 'react-native-render-html';
import {getSupabaseFileUrl} from "../services/imagesService";

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

const PostCard = ({item, currentUser, router, hasShadow = true}) => {

    const shadowStyle = {
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    // for format data
    const createdAt = moment(item?.created_at).format('MMM D')

    const openPostDetails = () => {

    }

    //
    const likes=[]
    const liked = true
    // console.log('item?.user?.image',getSupabaseFileUrl(item?.user?.image))

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
                        <Text style={styles.postTime}>{createdAt}</Text>
                    </View>
                </View>

                {/*    three dots*/}
                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name='threeDotsHorizontal' size={hp(3.4)} color={theme.colors.text} strokeWidth={3}/>
                </TouchableOpacity>


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
                        <TouchableOpacity>
                            <Icon name='heart' fill={liked ? theme.colors.rose : 'transparent'} size={24} color={liked ? theme.colors.rose : theme.colors.textLight}/>
                        </TouchableOpacity>

                        <Text style={styles.count}>
                            {likes?.length}
                        </Text>

                    </View>

                    {/*comments*/}
                    <View style={styles.footerButton}>
                        <TouchableOpacity>
                            <Icon name='comment' size={24} color={theme.colors.textLight}/>
                        </TouchableOpacity>

                        <Text style={styles.count}>
                            {0}
                        </Text>

                    </View>

                    {/*share post*/}
                    <View style={styles.footerButton}>
                        <TouchableOpacity>
                            <Icon name='share' size={24} color={theme.colors.textLight}/>
                        </TouchableOpacity>
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
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    }
})

export default PostCard;
