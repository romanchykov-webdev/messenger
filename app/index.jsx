import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useRouter} from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import Loading from "../components/Loading";

const Index = () => {
    const router = useRouter();

  return (
    <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
        <Loading/>
    </View>
  );
};

const styles = StyleSheet.create({})

export default Index;
