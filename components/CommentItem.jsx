import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {theme} from "../constants/theme";
import {hp} from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";

const CommentItem = ({item,canDelete=false,onDelete=()=>{}}) => {

    const createdAt=moment(item?.created_at).format('MMM D')

const handleDelete=()=>{
    Alert.alert('Confirm', 'Are you sure you want to do this?', [
        {
            text: 'Cancel',
            onPress: () => console.log('modal cancel'),
            style: 'cancel'
        },
        {
            text: 'Delete',
            onPress: () => onDelete(item),
            style: 'destructive'
        }
    ]);
}

    return (
        <View style={styles.container}>
        {/*    avatar*/}
            <Avatar uri={item?.user?.image}/>

        {/*    content*/}
            <View style={styles.content}>

                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.text}>{item?.user?.name}</Text>
                        <Text>*</Text>
                        <Text style={[styles.text,{color:theme.colors.textLight}]}>{createdAt}</Text>
                    </View>

                    {
                        canDelete &&(
                            <TouchableOpacity onPress={handleDelete}>
                                <Icon name='delete' color={theme.colors.rose}/>
                            </TouchableOpacity>
                        )
                    }

                </View>
                <Text style={[styles.text,{fontWeight: 'normal'}]}>
                    {item?.text}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        gap: 7,
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
    },
    highlight: {
        borderWidth: 0.2,
        backgroundColor: 'white',
        borderColor: theme.colors.dark,
        shadowColor: theme.colors.dark,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    text: {
        fontSize: hp(1.6),
        fontWeight: theme.fonts.medium,
        color: theme.colors.textDark,
    }
})

export default CommentItem;
