import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Stack, useRouter} from "expo-router";
import {AuthProvider, useAuth} from "../contexts/AuthContext";
import {supabase} from "../lib/supabase";
import {getUserData} from "../services/userService";


const _layout = () => {
    return (
        <AuthProvider>
            <RootLayout/>
        </AuthProvider>
    )
}

const RootLayout = () => {

    const {setAuth, setUserData} = useAuth();

    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            // console.log('session user:', session?.user)
            // console.log('session user:', session?.user.id)

            if (session) {
                //set auth
                //move to home screen
                setAuth(session?.user);
                updateUserData(session?.user,session?.user?.email)
                router.replace('/home')
            } else {
                //set auth null
                //move to welcome screen
                setAuth(null)
                router.replace('/welcome')
            }

        })


    }, [])

    const updateUserData = async (user,email) => {
        let res = await getUserData(user?.id);
        // console.log('got user data:', res)

        if (res.success) setUserData({...res.data, email});

    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
};

const styles = StyleSheet.create({})

export default _layout;
