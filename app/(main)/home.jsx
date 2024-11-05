import React from 'react';
import {View, Text, StyleSheet, Alert, Button} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {useAuth} from "../../contexts/AuthContext";
import {supabase} from "../../lib/supabase";

const HomeScreen = () => {

    const {user,setAuth} = useAuth();

    console.log('user',user);

    const onLogOut = async () => {
        // setAuth(null);

        const {error}=await supabase.auth.signOut();

        if(error){
            Alert.alert('Sign out',"Error signing out!");
        }
    }

    return (
        <ScreenWrapper>
            <Text>HomeScreen works!</Text>
            <Button title="LogOut" onPress={onLogOut}/>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({})

export default HomeScreen;
