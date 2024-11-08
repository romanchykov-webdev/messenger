import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {theme} from "../../constants/theme";
import {hp, wp} from "../../helpers/common";
import Header from "../../components/Header";
import {useAuth} from "../../contexts/AuthContext";
import Avatar from "../../components/Avatar";
import {StatusBar} from "expo-status-bar";
import RichTextEditor from "../../components/RichTextEditor";
import {useRouter} from "expo-router";

const NewPost = () => {

    const {user} = useAuth()

    // console.log('user',user)

    const bodyRef = useRef("");
    const editorRef = useRef(null);
    const router=useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(file)


    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <Header title="Create post"/>

                <ScrollView
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{gap: 20}}
                >
                    <StatusBar style="dark"/>

                    {/*    avatar   */}
                    <View style={styles.header}>
                        <Avatar
                            uri={user?.image}
                            size={hp(7.5)}
                            rounded={theme.radius.xl}
                        />
                        <View style={{gap: 2}}>
                            <Text style={styles.userName}>
                                {user?.name}
                            </Text>
                            <Text style={styles.publicText}>
                                Public
                            </Text>
                        </View>
                    </View>

                    {/*    text editor*/}
                    <View style={styles.textEdit}>
                        <RichTextEditor editorRef={editorRef} onChange={(body) => bodyRef.current = body}/>
                    </View>

                </ScrollView>

            </View>

        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'red',
        marginBottom: 30,
        paddingHorizontal: wp(4),
        gap: 15,
    },
    title: {
        // marginLeft:10,
        fontSize: hp(2.5),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 12,
    },
    userName: {
        fontSize: hp(2.2),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text,
    },
    avatar: {
        height: hp(6.5),
        width: hp(6.5),
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1'
    },
    publicText: {
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textLight
    },
    textEdit: {
        // marginTop: 10
    },
    media: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        padding: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
    },
    mediaIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    addImageText: {
        fontSize: hp(1.9),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.text
    },
    imageIcon: {
        // backgroundColor: theme.colors.gray,
        borderRadius: theme.radius.md,
        // padding:6,
    },
    file: {
        height: hp(30),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    video: {},
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        // box shadow
        // shadowColor:theme.colors.textLight,
        // shadowOffset:{width:0, height:3},
        // shadowOpacity:0.6,
        // shadowRadius:8,
        // elevation:5,
    }
})

export default NewPost;
