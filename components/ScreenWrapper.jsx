import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

const ScreenWrapper = ({children, bg}) => {

    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 5 : 30;

    return (
        <View style={{flex: 1, paddingTop, backgroundColor: bg}}>
            <StatusBar style="dark"/>
            {
                children
            }
        </View>
    );
};

const styles = StyleSheet.create({})

export default ScreenWrapper;
