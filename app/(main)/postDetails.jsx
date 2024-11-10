import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import {createComment, fetchPostsDetails, removeComment, removePost} from "../../services/postService";
import {theme} from "../../constants/theme";
import {hp, wp} from "../../helpers/common";
import {useAuth} from "../../contexts/AuthContext";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import InputCustom from "../../components/InputCustom";
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import {supabase} from "../../lib/supabase";
import {getUserData} from "../../services/userService";

// for up input //поднимает контент при открытии клавиатуры
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createNotification} from "../../services/notificationService";

const PostDetails = () => {

    const [startLoading, setStartLoading] = useState(true)

    const [loading, setLoading] = useState(false)

    const inputRef = useRef(null)
    const commentRef = useRef('')

    //   get pist Id
    const {postId,commentId} = useLocalSearchParams()
    // console.log('got post id:',postId)
    // console.log('got post commentId:',commentId)

    const {user} = useAuth()

    const router = useRouter()

    const [post, setPost] = useState(null)

    // console.log('post', post)

    // useEffect(() => {
    //     getPostDetails()
    // }, [])

    const handleNewComment = async (payload) => {
        // console.log('got new comment', payload.new);

        if (payload.new) {
            let newComment = {...payload.new};
            let res = await getUserData(newComment.userId);
            newComment.user = res.success ? res.data : {};
            setPost(prevPost => {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost.comments]
                }
            })
        }

    }

    // update post comments
    useEffect(() => {

        let commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `postId=eq.${postId}`
            }, handleNewComment)
            .subscribe()


        getPostDetails()

        return () => {
            supabase.removeChannel(commentChannel)
        }

    }, [])


    const getPostDetails = async () => {
        //     fetch post details here
        let res = await fetchPostsDetails(postId);
        // console.log('post details',res)

        // if (res.success) setPost(res.data);

        if (res.success) {
            // Сортируем комментарии по убыванию даты создания
            const sortedComments = res.data.comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setPost({ ...res.data, comments: sortedComments });
        }

        setStartLoading(false)

    }


    // add new comment
    const onNewComment = async () => {
        if (!commentRef.current) return null;

        let data = {
            userId: user?.id,
            postId: post?.id,
            text: commentRef.current,
        }
        //     create comment
        setLoading(true)
        let res = await createComment(data)
        if (res.success) {
            // send notification later
            if(user.id!=post.userId){
                let notify={
                    senderId:user.id,
                    receiverId:post.userId,
                    title:'Commented on your post',
                    data:JSON.stringify({postId:post.id,commentId:res?.data?.id})
                }
                createNotification(notify)
            }
            // send notification later
            inputRef?.current?.clear();
            commentRef.current = "";
            // commentRef.current?.setContentHTML('');
        } else {
            Alert.alert('Comment', res.msg)
        }
        setLoading(false)

    }

    // delete comments
    const onDeleteComment = async (comment) => {
        // console.log('comment for delete',comment)
        let res = await removeComment(comment?.id);

        if (res.success) {

            setPost(prevPost => {
                let updatePost = {...prevPost};
                updatePost.comments = updatePost.comments.filter(c => c.id != comment.id);
                return updatePost;
            })

        } else {
            Alert.alert('Comment', res.msg)
        }
    }

    // for delete post
    const onDeletePost = async (item) => {
        // console.log('delete post:',item)
        //     delete post here

        let res = await removePost(post.id)

        if (res.success) {
            router.back()
        } else {
            Alert.alert('Post remove', res.msg)
        }

    }


    // for Edip post
    const onEditPost = async (item) => {
        // console.log(' edit post:', item)
        //     edip post here
        router.back()
        router.push({
            pathname: 'newPost',
            params: {...item}
        })
    }

    if (startLoading) {
        return (
            <View style={styles.center}>
                <Loading size='small'/>
            </View>
        )
    }

    if (!post) {
        return (
            <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
                <Text style={styles.notFound}>Post not Found</Text>
            </View>
        )
    }


    return (

        <View style={styles.container}>
            <KeyboardAwareScrollView
                //поднимает контент при открытии клавиатуры
                contentContainerStyle={{backgroundColor: 'white'}}
                enableOnAndroid={true}
                extraHeight={100} // настройте высоту
            >

                <ScrollView
                    keyboardDismissMode='on-drag'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                >

                    <PostCard
                        item={{...post, comments: [{count: post?.comments?.length}]}}
                        currentUser={user}
                        router={router}
                        hasShadow={false}
                        showMoreIcon={false}
                        showDelete={true}
                        onDelete={onDeletePost}
                        onEdit={onEditPost}
                    />
                    {/*    comment block*/}
                    <View style={styles.inputContainer}>
                        <InputCustom
                            inputRaf={inputRef}
                            placeholder='Type comments...'
                            onChangeText={(value) => (commentRef.current = value)}
                            placeholderTextColor={theme.colors.textLight}
                            containerStyle={{flex: 1, height: hp(6.3), borderRadius: theme.radius.xl}}
                        />
                        {
                            loading
                                ? (
                                    <View style={styles.loading}>
                                        <Loading size='small'/>
                                    </View>
                                )
                                : (
                                    <TouchableOpacity style={styles.sedIcon} onPress={onNewComment}>
                                        <Icon name='send' color={theme.colors.primaryDark}/>
                                    </TouchableOpacity>
                                )
                        }

                    </View>

                    {/*    comments list*/}
                    <View style={{marginVertical: 15, gap: 17}}>
                        {
                            post?.comments?.map(comment =>
                                <CommentItem
                                key={comment?.id?.toString()}
                                item={comment}
                                canDelete={user.id === comment.userId || user.id === post.userId}
                                onDelete={onDeleteComment}
                                highlight={comment.id == commentId}
                            />)
                        }
                        {
                            post?.comments?.length == 0 && (
                                <Text style={{color: theme.colors.text, marginLeft: 5}}>
                                    Be first to comment
                                </Text>
                            )
                        }

                    </View>

                </ScrollView>
            </KeyboardAwareScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sedIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    center: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignSelf: 'center',
        transform: [{scale: 1.3}]
    }
})

export default PostDetails;
