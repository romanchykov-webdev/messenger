import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import ScreenWrapper from "../components/ScreenWrapper";
import {theme} from "../constants/theme";
import Icon from "../assets/icons";
import BackButton from "../components/BackButton";
import {hp, wp} from "../helpers/common";
import InputCustom from "../components/InputCustom";
import ButtonCustom from "../components/ButtonCustom";
import {useRouter} from "expo-router";

const SignUp = () => {

    const router = useRouter()

    const nameRef = useRef('')
    const emailRef = useRef('')
    const passwordRef = useRef('')

    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {

        if (!nameRef || !emailRef.current || !passwordRef.current) {
            Alert.alert('Sign Up', "Please fill all the fields!");
            return;
        }

        //     good to go


    }

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>

                {/*    button back*/}
                <BackButton/>

                {/*welcome text*/}
                <View>
                    <Text style={styles.welcomeText}>Let`s</Text>
                    <Text style={styles.welcomeText}>Get Started</Text>
                </View>

                {/*form*/}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                        Please fill the details to create an account.
                    </Text>

                    {/*input Username*/}
                    <InputCustom
                        icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
                        placeholder='Enter your name'
                        onChangeText={value => nameRef.current = value}
                    />

                    {/*input email*/}
                    <InputCustom
                        icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
                        placeholder='Enter your email'
                        onChangeText={value => emailRef.current = value}
                    />

                    {/*input password*/}
                    <InputCustom
                        icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
                        secureTextEntry
                        placeholder='Enter your password'
                        onChangeText={value => passwordRef.current = value}
                    />



                    {/*    button un submit*/}
                    <ButtonCustom
                        title="Sign Up"
                        onPress={onSubmit}
                        loading={loading}
                    />
                </View>

                {/*    footer   */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?
                    </Text>

                    <Pressable>
                        <Text
                            onPress={() => router.push('login')}
                            style={[styles.footerText, {
                                color: theme.colors.primaryDark,
                                fontWeight: theme.fonts.semibold
                            }]}>
                            Login
                        </Text>
                    </Pressable>

                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5),
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    footerText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }

})

export default SignUp;
