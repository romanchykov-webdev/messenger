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
import {supabase} from "../lib/supabase";

const Login = () => {

    const router = useRouter()

    const emailRef = useRef('')
    const passwordRef = useRef('')

    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {

        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', "Please fill all the fields!");
            return;
        }

        //     good to go
        let email = emailRef.current.trim();
        let password = passwordRef.current.trim();

        setLoading(true)

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)

        console.log('error',error);
        if(error){
            Alert.alert('Login', error.message);
        }

    }

    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>

                {/*    button back*/}
                <BackButton/>

                {/*welcome text*/}
                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome</Text>
                </View>

                {/*form*/}
                <View style={styles.form}>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                        Please login to continue.
                    </Text>
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

                    {/*    forgot password*/}
                    <Text style={styles.forgotPassword}>
                        Forgot your password?
                    </Text>

                    {/*    button un submit*/}
                    <ButtonCustom
                        title="Login"
                        onPress={onSubmit}
                        loading={loading}
                    />
                </View>

                {/*    footer   */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Dont`t have an account?
                    </Text>

                    <Pressable>
                        <Text
                            onPress={() => router.push('signUp')}
                            style={[styles.footerText, {
                                color: theme.colors.primaryDark,
                                fontWeight: theme.fonts.semibold
                            }]}>
                            Sign up
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

export default Login;
