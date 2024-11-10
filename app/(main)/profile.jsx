import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, Pressable, ScrollView, FlatList} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {useAuth} from "../../contexts/AuthContext";
import {useRouter} from "expo-router";
import Header from "../../components/Header";
import {hp, wp} from "../../helpers/common";
import Icon from "../../assets/icons";
import {theme} from "../../constants/theme";
import {supabase} from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import {StatusBar} from "expo-status-bar";
import {fetchPosts} from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";

let limit = 0

const Profile = () => {

    const {user, setAuth} = useAuth()

    //
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)

    const router = useRouter();

    const onLogOut = async () => {
        // setAuth(null);

        const {error} = await supabase.auth.signOut();

        if (error) {
            Alert.alert('Sign out', "Error signing out!");
        }
    }


    const getPosts = async () => {

        if (!hasMore) return null;

        // limit = limit + 10;
        limit = limit + 4;
        let res = await fetchPosts(limit, user.id)
        // console.log('get all post limit 10:', res)
        // console.log('user:', res.data[0].user)

        if (res.success) {
            // if no has posts
            if (posts.length === res.data.length) setHasMore(false)
            setPosts(res.data);
        }
    }


    const handleLogOut = async () => {
        //     show confirm modal

        Alert.alert('Confirm', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancel'),
                style: 'cancel'
            },
            {
                text: 'LogOut',
                onPress: () => onLogOut(),
                style: 'destructive'
            }
        ]);

    }

    return (
        <ScreenWrapper bg="white">
            <FlatList
                data={posts}
                ListHeaderComponent={<UserHeader user={user} router={router} handleLogOut={handleLogOut}/>}
                ListHeaderComponentStyle={{marginBottom:50}}
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
                ListFooterComponent={hasMore ? (
                        <View style={{marginVertical: posts.length > 0 ? 100 : 30}}>
                            <Loading/>
                        </View>
                    )
                    : (
                        <View style={{marginVertical: 30}}>
                            <Text style={styles.noPosts}>No more posts</Text>
                        </View>
                    )
                }
            />

        </ScreenWrapper>
    );
};

const UserHeader = ({user, router, handleLogOut}) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: wp(4)}}>
            <View>
                <Header title="Profile" mb={30}/>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
                    <Icon name='logout' color={theme.colors.rose}/>
                </TouchableOpacity>
            </View>

            {/* avatar   */}
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{gap: 15}}>
                    <StatusBar style="dark"/>

                    {/* avatar   */}
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={user?.image}
                            size={hp(12)}
                            rounted={theme.radius.xxl * 1.4}
                        />
                        <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
                            <Icon name='edit' strokeWidth={2.5} size={20}/>
                        </Pressable>
                    </View>

                    {/*    userName and address*/}
                    <View style={{alignItems: 'center', gap: 10}}>
                        <Text style={styles.userName}>{user && user.name}</Text>
                        <Text style={styles.infoText}>{user && user.address}</Text>
                    </View>

                    {/*    email phone bio*/}
                    <View style={{gap: 10,}}>

                        <View style={styles.info}>
                            <Icon name="mail" color={theme.colors.textLight} size={20}/>
                            <Text style={styles.infoText}>{user && user.email} </Text>
                        </View>

                        {/*    phone*/}
                        {
                            user && user.phoneNumber && (
                                <View style={styles.info}>
                                    <Icon name="call" color={theme.colors.textLight} size={20}/>
                                    <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                                </View>
                            )
                        }

                        {/*    bio*/}
                        {
                            user && user.bio && (
                                <Text style={styles.infoText}>{user.bio}</Text>
                            )
                        }

                    </View>

                </ScrollView>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        mHorizontal: wp(4),
        mBottom: 20,
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: 'center',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        // box shadow
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    userName: {
        fontSize: hp(3),
        fontWeight: '500',
        color: theme.colors.textDark,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight,
    },
    logoutButton: {
        position: 'absolute',
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: '#fee2e2',
    },
    listStyle: {
        paddingHorizontal: wp(4),
        pBottom: 30,
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text,
    }

})

export default Profile;
