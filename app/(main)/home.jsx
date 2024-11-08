import React from 'react';
import {View, Text, StyleSheet, Alert, Button, Pressable} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {useAuth} from "../../contexts/AuthContext";
import {supabase} from "../../lib/supabase";
import {hp, wp} from "../../helpers/common";
import {theme} from "../../constants/theme";
import Icon from "../../assets/icons";
import {useRouter} from "expo-router";
import Avatar from "../../components/Avatar";

const HomeScreen = () => {

    const router=useRouter();

    const {user, setAuth} = useAuth();

    console.log('user', user);

    // const onLogOut = async () => {
    //     // setAuth(null);
    //
    //     const {error} = await supabase.auth.signOut();
    //
    //     if (error) {
    //         Alert.alert('Sign out', "Error signing out!");
    //     }
    // }

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>

            {/*    header   */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        InstBox
                    </Text>

                    {/*icons*/}
                    <View style={styles.icons}>
                        {/*heart*/}
                        <Pressable onPress={()=>router.push('/notifications')}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                        </Pressable>

                        {/*plus*/}
                        <Pressable onPress={()=>router.push('/newPost')}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                        </Pressable>

                        {/*user*/}
                        <Pressable onPress={()=>router.push('/profile')}>
                           <Avatar
                               uri={user?.image}
                               size={hp(4.3)}
                               rounded={theme.radius.sm}
                               style={{borderWidth:2}}
                           />
                        </Pressable>
                    </View>
                </View>
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
    title:{
        color:theme.colors.text,
        fontSize:hp(3.2),
        fontWeight: theme.fonts.bold,
    },
    imageAvatar:{
        height:hp(4.3),
        width:hp(4.3),
        borderRadius:theme.radius.sm,
        borderCurve:'continuous',
        borderColor:theme.colors.gray,
        borderWidth:3,
    },
    icons:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:10,
    },
    listStyle:{
        paddingTop:20,
        paddingHorizontal:wp(4),
    },
    noPosts:{
        fontSize:hp(2),
        textAlign:'center',
        color:theme.colors.text,
    },
    pill:{
        position:'absolute',
        right:-10,
        top:-4,
    }
})

export default HomeScreen;
