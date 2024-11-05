import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "../assets/icons";
import {hp} from "../helpers/common";
import {theme} from "../constants/theme";

import {Image} from 'expo-image'
import {getUserImageSrc} from "../services/imagesService";

const Avatar = ({
    uri,
    size=hp(4.5),
    rounded=theme.radius.md,
    style={}
                }) => {

    // <Icon name="user" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
  return (
    <Image
        source={getUserImageSrc(uri)}
        transition={100}
        style={[styles.avatar, {height:size,width:size,borderRadius:rounded},style]}

    />
  );
};



export default Avatar;
const styles = StyleSheet.create({
    avatar:{
        borderCurve:'continuous',
        borderColor:theme.colors.darkLight,
        borderWidth:1,
    }
})