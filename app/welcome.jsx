import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import ScreenWrapper from "../components/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import {hp, wp} from "../helpers/common";
import {theme} from "../constants/theme";
import Button from "../components/Button";

const Welcome = () => {
    return (
        <ScreenWrapper bg="white">
            <StatusBar style="dark"/>
            <View style={styles.container}>

                {/*    welcome image    */}
                <Image style={styles.welcomeImage}
                       source={require('../assets/images/welcome.png')}
                       resizeMode="contain"
                />
                {/*    title    */}
                <View style={{gap: 20}}>

                    <Text style={styles.title}>Messenger</Text>
                    <Text style={styles.punchline}>
                        Where every thought finds a home end image tells a story.
                    </Text>

                </View>

                {/*    footer   */}
                <View style={styles.footer}>

                    <Button
                        title="Gettong started"
                        buttonStyle={{marginHorizontal: wp(3)}}
                        onPress={() => {
                        }}
                    />

                    {/*    */}
                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>
                            Already have an account
                        </Text>
                        <Pressable>
                            <Text style={[styles.loginText,{color:theme.colors.primaryDark,fontWeight:theme.fonts.semibold}]}>Login</Text>
                        </Pressable>
                    </View>


                </View>
            </View>

        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        width: wp(100),
        height: hp(30),
        alignItems: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: 'center',
        fontWeight: theme.fonts.extraBold,

    },
    punchline: {
        textAlign: 'center',
        paddingHorizontal: wp(10),
        fontSize: hp(1.7),
        color: theme.colors.text,

    },
    footer: {
        gap: 30,
        width: '100%'
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    },
})

export default Welcome;
