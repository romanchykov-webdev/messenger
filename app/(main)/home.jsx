import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, RefreshControl} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {useAuth} from "../../contexts/AuthContext";
import {hp, wp} from "../../helpers/common";
import {theme} from "../../constants/theme";
import Icon from "../../assets/icons";
import {useRouter} from "expo-router";
import Avatar from "../../components/Avatar";
import {fetchPosts} from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import {supabase} from "../../lib/supabase";
import {getUserData} from "../../services/userService";
import {StatusBar} from "expo-status-bar";


let limit = 0

const HomeScreen = () => {

    const router = useRouter();

    const {user, setAuth} = useAuth();

    //  for refreshing
    const [isRefreshing, setIsRefreshing] = useState(false);
    //  for refreshing

    // console.log('user', user);

    // const onLogOut = async () => {
    //     // setAuth(null);
    //
    //     const {error} = await supabase.auth.signOut();
    //
    //     if (error) {
    //         Alert.alert('Sign out', "Error signing out!");
    //     }
    // }


    // get posts
    const [posts, setPosts] = useState([])

    // if not has posts
    const [hasMore, setHasMore] = useState(true)

    // count notifications
    const [notificationCount, setNotificationCount] = useState(0)

    // Функция для обработки событий новых постов
    const handlePostEvent = async (payload) => {
        // console.log('payload', payload)
        if (payload.eventType === 'INSERT' && payload?.new?.id) {
            let newPost = {...payload.new};
            let res = await getUserData(newPost.userId);

            newPost.postLikes = []
            newPost.comments = [{count: 0}]

            newPost.user = res.success ? res.data : {}
            setPosts(prevPosts => [newPost, ...prevPosts])
        }

        if (payload.eventType === 'DELETE' && payload.old.id) {
            setPosts(prevPosts => {
                let updatePosts = prevPosts.filter(post => post.id != payload.old.id);
                return updatePosts;
            })
        }

        //     if update posts
        if (payload.eventType === 'UPDATE' && payload?.new?.id) {

            setPosts(prevPosts => {
                let upDatePosts = prevPosts.map(post => {
                    if (post.id === payload.new.id) {
                        post.body = payload.new.body;
                        post.file = payload.new.file;
                    }
                    return post;
                })
                return upDatePosts;
            })
        }

    }

    // Функция для обработки событий новых комментариев
    const handleNewComment = async (payload) => {
        if (payload.eventType === 'INSERT') {
            const newComment = payload.new;
            // console.log("New comment:", newComment);

            // Обновляем количество комментариев для соответствующего поста
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.id === newComment.postId) {
                        // Увеличиваем количество комментариев на 1
                        return {
                            ...post,
                            comments: [{ count: (post.comments[0].count || 0) + 1 }]
                        };
                    }
                    return post;
                });
            });
        }
    };

    // Функция для обработки событий новых лайков
    // console.log('post',posts)


    // console.log('posts',posts[1].postLikes)
    // Функция для обработки новых лайков
    const handleNewLike = (payload) => {
        // console.log('Received payload:', payload);  // Лог для диагностики

        if (payload.eventType === 'INSERT') {
            const newLike = payload.new;
            // console.log('New like:', newLike);  // Лог для новых лайков

            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.id === newLike.postId) {
                        return {
                            ...post,
                            postLikes: [...post.postLikes, newLike]
                        };
                    }
                    return post;
                });
            });
        } else if (payload.eventType === 'DELETE') {
            const removedLike = payload.old;
            // console.log('Removed like:', removedLike);  // Лог для удаленных лайков

            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.id === removedLike.postId) {
                        return {
                            ...post,
                            postLikes: post.postLikes.filter(like => like.id !== removedLike.id)
                        };
                    }
                    return post;
                });
            });
        }
    };






    // Функция для обработки событий новых notifications
    const handleNewNotification = async (payload) => {
        // console.log('got new natification', payload)
        if (payload.eventType === 'INSERT' && payload?.new?.id) {
            setNotificationCount(prev => prev + 1)
            //     const newComment = payload.new;
            //     console.log("New comment:", newComment);
            //     // Здесь можно обновить интерфейс или состояние, если нужно отобразить новый notifications
        }
    };



    // useEffect(() => {
    //
    //     let postChannel = supabase
    //         .channel('posts')
    //         .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
    //         .subscribe()
    //
    //
    //     // getPosts()
    //
    //     return () => {
    //         supabase.removeChannel(postChannel)
    //     }
    //
    // }, [])

    // useEffect для подписки на события новых постов и комментариев
    useEffect(() => {
        // Создание канала для подписки на изменения в таблице `posts`
        const postChannel = supabase
            .channel('posts')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'posts'
            }, handlePostEvent)
            .subscribe();

        // Создание канала для подписки на новые комментарии в таблице `comments`
        const commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments'
            }, handleNewComment)
            .subscribe();

        // Подписка на события новых postLikes
        const likesChannel = supabase
            .channel('postLikes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'postLikes'
            }, handleNewLike)
            .subscribe();



        // для подписки на изменения в таблице `notifications`
        const notificationsChannel = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `receiverId=eq.${user.id}`
            }, handleNewNotification)
            .subscribe();

        // Удаление подписок при размонтировании компонента
        return () => {
            supabase.removeChannel(postChannel);
            supabase.removeChannel(commentChannel);
            supabase.removeChannel(likesChannel);
            supabase.removeChannel(notificationsChannel);
        };
    }, []);


    const getPosts = async () => {

        if (!hasMore) return null;

        // limit = limit + 10;
        limit = limit + 4;
        let res = await fetchPosts(limit)
        // console.log('get all post limit 10:', res)
        // console.log('user:', res.data[0].user)

        if (res.success) {
            // if no has posts
            if (posts.length === res.data.length) setHasMore(false)
            setPosts(res.data);
        }
    }

    const handlerNotification = () => {
        setNotificationCount(0)
        router.push('/notifications')
    }
    // console.log('posts',posts)


    // Функция для обновления постов
    const onRefresh = async () => {
        setIsRefreshing(true);
        limit = 4; // Сброс лимита для загрузки первых постов
        const res = await fetchPosts(limit);
        if (res.success) {
            // console.log('refresh')
            // console.log('refreshqc', res.data[0])
            setPosts([]);
            setHasMore(true);
        }
        setIsRefreshing(false);
    };



    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>

                {/*    header   */}
                <View style={styles.header}>
                    <StatusBar style='dark'/>
                    <Text style={styles.title}>
                        FaRam
                    </Text>

                    {/*icons*/}
                    <View style={styles.icons}>
                        {/*heart*/}
                        <Pressable onPress={handlerNotification} style={{marginRight: 10}}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                            {
                                notificationCount > 0 && (
                                    <View style={styles.pill}>
                                        <Text style={styles.pillText}>
                                            {notificationCount}
                                        </Text>
                                    </View>
                                )
                            }
                        </Pressable>

                        {/*plus*/}
                        <Pressable onPress={() => router.push('/newPost')} style={{marginRight: 10}}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                        </Pressable>

                        {/*user*/}
                        <Pressable onPress={() => router.push('/profile')}>
                            <Avatar
                                uri={user?.image}
                                size={hp(4.3)}
                                rounded={theme.radius.sm}
                                style={{borderWidth: 2}}
                            />
                        </Pressable>
                    </View>
                </View>

                {/*    al post  limit 10*/}
                <FlatList
                    data={posts}
                    contentContainerStyle={styles.listStyle}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item,) => item.id.toString()}
                    renderItem={({item}) => <PostCard
                        item={item}
                        currentUser={user}
                        router={router}
                    />}
                    onEndReached={() => {
                        // get 10 posts limit+10
                        getPosts()
                        // console.log('is finish limit:', limit)
                    }}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={hasMore ? (
                            <View style={{marginVertical: posts.length > 0 ? 200 : 30}}>
                                <Loading/>
                            </View>
                        )
                        : (
                            <View style={{marginVertical: 30}}>
                                <Text style={styles.noPosts}>No more posts</Text>
                            </View>
                        )
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]} // Цвет индикатора для Android
                            tintColor={theme.colors.primary} // Цвет индикатора для iOS
                        />
                    }
                />

            </View>
            {/*<Button title="LogOut" onPress={onLogOut}/>*/}
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padHorizontal: wp(4),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: wp(4),
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    imageAvatar: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3,
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4),
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: 'center',
        color: theme.colors.text,
    },
    pill: {
        position: 'absolute',
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight,
    },
    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }
})

export default HomeScreen;
