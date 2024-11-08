import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Alert, ScrollView} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {hp, wp} from "../../helpers/common";
import {theme} from "../../constants/theme";
import Header from "../../components/Header";
import {useAuth} from "../../contexts/AuthContext";
import {getUserImageSrc, uploadFile} from "../../services/imagesService";

import {Image} from 'expo-image'
import Icon from "../../assets/icons";
import InputCustom from "../../components/InputCustom";
import ButtonCustom from "../../components/ButtonCustom";
import {updateUser} from "../../services/userService";
import {useRouter} from "expo-router";

import * as ImagePicker from 'expo-image-picker';
import {StatusBar} from "expo-status-bar";


const EditProfile = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const {user: currentUser, setUserData} = useAuth()


    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: '',
        bio: '',
        address: ''
    })

    useEffect(() => {

        if (currentUser) {
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: currentUser.image || '',
                bio: currentUser.bio || '',
                address: currentUser.address || '',
            })
        }

    }, [currentUser]);


    // const imageSource = getUserImageSrc(user.image)
    const imageSource = user.image && typeof user.image == 'object' ? user.image.uri : getUserImageSrc(user.image)


    // change avtar
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser({...user, image: result.assets[0]});
        }

    }

    // update data user
    const onSubmit = async () => {
        let userData = {...user};

        let {name, phoneNumber, bio, address, image} = userData;

        if (!name || !phoneNumber || !bio || !address || !image) {
            Alert.alert('Profile', 'Please fill all the fields!');
            return;
        }

        setLoading(true)

        // upload image avatar
        if (typeof image == 'object') {
            //     upload image
            let imageRes = await uploadFile('profiles', image?.uri, true);

            if (imageRes.success) userData.image = imageRes.data;
            else userData.image = null;

        }


        // update user
        const res = await updateUser(currentUser?.id, userData)

        setLoading(false)
        // console.log('update use result:',res)

        if (res.success) {
            setUserData({...currentUser, ...userData})
            router.back()
        }

    }

    return (
        <ScreenWrapper bg="white">
            <View style={styles.container}>
                <View style={{flex: 1}}>

                    {/*header*/}
                    <Header title="Edit profile"/>

                    {/*    form*/}
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={styles.form}
                    >
                        <StatusBar style="dark"/>

                        {/*    avatar*/}
                        <View style={styles.avatarContainer}>
                            <Image
                                source={imageSource}
                                style={styles.avatar}
                            />
                            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                                <Icon name='camera' size={20} strokeWidth={2.5}/>
                            </Pressable>
                        </View>

                        {/*    form*/}
                        <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                            Please fill your profile details.
                        </Text>

                        {/*user name*/}
                        <InputCustom
                            icon={<Icon name='user'/>}
                            placeholder='Enter you name'
                            value={user.name}
                            onChangeText={value => setUser({...user, name: value})}
                        />

                        {/*user phone*/}
                        <InputCustom
                            icon={<Icon name='call'/>}
                            placeholder='Enter you phone number'
                            value={user.phoneNumber}
                            onChangeText={value => setUser({...user, phoneNumber: value})}
                        />

                        {/*user address*/}
                        <InputCustom
                            icon={<Icon name='location'/>}
                            placeholder='Enter you address'
                            value={user.address}
                            onChangeText={value => setUser({...user, address: value})}
                        />

                        {/*user bio*/}
                        <InputCustom
                            // icon={<Icon name='call'/>}
                            placeholder='Enter you bio'
                            multiline={true}
                            containerStyle={styles.bio}
                            value={user.bio}
                            onChangeText={value => setUser({...user, bio: value})}
                        />


                        {/*    button on submit*/}
                        <ButtonCustom title="updata" loading={loading} onPress={onSubmit}/>
                    </ScrollView>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14),
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: theme.radius.xxl * 1.8,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    form: {
        gap: 18,
        marginTop: 20,
    }
    ,
    input: {
        fDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15,
    }
    ,
    bio: {
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 15,
        // backgroundColor:'red'
    }
})

export default EditProfile;
