import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";

const ScreenWrapper = ({children, bg}) => {

    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 5 : 30;

    return (
        // <ScrollView
        //     contentContainerStyle={{flex: 1, paddingTop, backgroundColor: bg}}
        //     keyboardDismissMode='on-drag'
        // >
        <View style={{flex: 1, paddingTop, backgroundColor: bg}}>
            {/*<StatusBar style="dark"/>*/}

            {
                children
            }
        </View>
        // </ScrollView>
    );
};

const styles = StyleSheet.create({})

export default ScreenWrapper;
