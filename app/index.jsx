import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useRouter} from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";

const Index = () => {
    const router = useRouter();

  return (
    <ScreenWrapper >
      <Text>Index works!</Text>
        <Button title="welcome" onPress={()=>router.push('welcome')}/>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({})

export default Index;
