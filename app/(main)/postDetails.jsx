import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useLocalSearchParams} from "expo-router";

const PostDetails = () => {

  //   get pist Id
    const {postId}=useLocalSearchParams()
    console.log('got post id:',postId)

  return (
    <View >
      <Text>PostDetails works!</Text>
        <Text>past id: {postId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({})

export default PostDetails;
