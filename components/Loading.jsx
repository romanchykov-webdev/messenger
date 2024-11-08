import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {theme} from "../constants/theme";

const Loading = ({size="large", color=theme.colors.primary}) => {
  return (
    <View style={{justifyContent:'center',alignItems: 'center'}}>
     <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({})

export default Loading;
