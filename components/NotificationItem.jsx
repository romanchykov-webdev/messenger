import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {theme} from "../constants/theme";
import {formatDate, formatTime, hp} from "../helpers/common";
import Avatar from "./Avatar";

const NotificationItem = ({
                              item,
                              router
                          }) => {

    console.log('item', item)

    const handleClick = () => {
        // open post details
        let {postId, commentId} = JSON.parse(item?.data);
        // console.log('postId',postId)
        // console.log('commentId',commentId)
        router.push({pathname: 'postDetails', params: {postId, commentId}})
    }

    // format data


    return (
        <TouchableOpacity
            onPress={handleClick}
            style={styles.container}
        >

            <Avatar
                uri={item?.sender?.image}
                size={hp(5)}
            />
            <View style={styles.nameTitle}>
                <Text style={[styles.text]}>
                    {item?.sender?.name}
                </Text>
                <Text style={[styles.text, {color: theme.colors.textDark}]}>
                    {item?.title}
                </Text>
            </View>
            <View style={{alignItems:'center'}}>
                <Text style={[styles.text, {color: theme.colors.textLight}]}>
                    {formatDate(item?.created_at)}
                </Text>
                <Text style={[styles.text, {color: theme.colors.textLight}]}>
                    {formatTime(item?.created_at)}
                </Text>

            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.darkLight,
        padding: 15,
        // paddingVertical:12,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
    },
    nameTitle: {
        flex: 1,
        gap: 2
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
    }
})

export default NotificationItem;
