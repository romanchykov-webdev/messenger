import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {theme} from "../../constants/theme";
import {hp, wp} from "../../helpers/common";
import Header from "../../components/Header";
import {useAuth} from "../../contexts/AuthContext";
import Avatar from "../../components/Avatar";
import {StatusBar} from "expo-status-bar";
import RichTextEditor from "../../components/RichTextEditor";
import {useRouter} from "expo-router";
import Icon from "../../assets/icons";
import ButtonCustom from "../../components/ButtonCustom";
import * as ImagePicker from "expo-image-picker";
import {Image} from "expo-image";
import {getSupabaseFileUrl} from "../../services/imagesService";
// for video
import {Video} from 'expo-av';
import {createOrUpdatePost} from "../../services/postService";


const NewPost = () => {

    const {user} = useAuth()

    // console.log('user',user)

    const bodyRef = useRef("");
    const editorRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(file)

    const onPick = async (isImage) => {

        let mediaConfig = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        }

        if (!isImage) {
            mediaConfig = {
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

        // console.log('file',result.assets[0])
        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    }

    // getFileType
    const isLocalFile = file => {
        if (!file) return null;
        if (typeof file == 'object') return true;

        return false;
    }

    const getFileType = file => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.type;
        }

        //     check image or video for remote file
        if (file.include('postImages')) {
            return 'image'
        }

        return 'video'

    }

    // get file uri
    const getFileUri = file => {
        if (!file) return null;
        if (isLocalFile(file)) {
            return file.uri;
        }

        //     if file not local
        return getSupabaseFileUrl(file)?.uri;

    }

    // on submit
    const onSubmit = async () => {

        console.log('body', bodyRef.current)
        console.log('file', file)

        if (!bodyRef.current && !file) {
            Alert.alert('Post', 'Pleas choose an image or add post body')
            return;
        }
        let data = {
            file,
            body: bodyRef.current,
            userId: user?.id,
        }

        //     create post

        setLoading(true)
        let res = await createOrUpdatePost(data)
        setLoading(false)

        console.log('post res:', res)

        if (res.success) {
            setFile(null)
            bodyRef.current = '';
            editorRef.current?.setContentHTML('');
            router.back();
        } else {
            Alert.alert('Post', res.msg)
        }

    }

    console.log('file uri',getFileUri(file));
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

                    {/*block if has image or video */}
                    {
                        file && (
                            <View style={styles.file}>

                                {
                                    getFileType(file) == 'video'
                                        ? (
                                            <Video
                                                style={{flex: 1}}
                                                source={{uri: getFileUri(file)}}
                                                useNativeControls
                                                resizeMode='cover'
                                                isLooping
                                            />
                                        )
                                        : (
                                            <Image
                                                source={{uri: getFileUri(file)}}
                                                style={{flex: 1}}
                                                // resizeMode='cover'
                                                contentFit="cover"
                                            />
                                        )
                                }
                                <Pressable
                                    onPress={() => setFile(null)}
                                    style={styles.closeIcon}
                                >

                                    <Icon name='delete' size={30} color='white'/>
                                </Pressable>

                            </View>
                        )
                    }

                    {/*    block media  */}
                    <View style={styles.media}>

                        <Text style={styles.addImageText}>
                            Add to your post
                        </Text>

                        {/*block icons*/}
                        <View style={styles.mediaIcons}>
                            {/*get image*/}
                            <TouchableOpacity onPress={() => onPick(true)}>
                                <Icon name="image" size={30} color={theme.colors.dark}/>
                            </TouchableOpacity>

                            {/*get video*/}
                            <TouchableOpacity onPress={() => onPick(false)}>
                                <Icon name="video" size={33} color={theme.colors.dark}/>
                            </TouchableOpacity>
                        </View>


                    </View>

                </ScrollView>
                <ButtonCustom
                    title='Post'
                    buttonStyle={{height: hp(6.2)}}
                    loading={loading}
                    hasShadow={false}
                    onPress={onSubmit}
                />

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
        // borderWidth:1,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        overflow: 'hidden',
    },
    video: {},
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        backgroundColor: 'rgba(255,0,0,0.2)',
        borderRadius: 50,
        // box shadow
        // shadowColor:theme.colors.textLight,
        // shadowOffset:{width:0, height:3},
        // shadowOpacity:0.6,
        // shadowRadius:8,
        // elevation:5,
    }
})

export default NewPost;
