import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
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


var limit = 0

const HomeScreen = () => {

    const router = useRouter();

    const {user, setAuth} = useAuth();

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

    const handlePostEvent = async (payload) => {
        // console.log('payload',payload)
        if (payload.eventType === 'INSERT') {
            let newPost = {...payload.new};
            let res = await getUserData((newPost.userId));
            newPost.user = res.success ? res.data : {}
            setPosts(prevPosts => [newPost, ...prevPosts])
        }

    }

    useEffect(() => {

        let postChannel = supabase
            .channel('posts')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'posts'}, handlePostEvent)
            .subscribe()


        // getPosts()

        return () => {
            supabase.removeChannel(postChannel)
        }

    }, [])

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

    // console.log('posts',posts)
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
                        <Pressable onPress={() => router.push('/notifications')}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                        </Pressable>

                        {/*plus*/}
                        <Pressable onPress={() => router.push('/newPost')}>
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
                        console.log('is finish limit:', limit)
                    }}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={hasMore?(
                        <View style={{marginVertical: posts.length > 0 ? 200 : 30}}>
                            <Loading/>
                        </View>
                    )
                        :(
                            <View style={{marginVertical:30}}>
                                <Text style={styles.noPosts}>No more posts</Text>
                            </View>
                        )
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
    }
})

export default HomeScreen;
