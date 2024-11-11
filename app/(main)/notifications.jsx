import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import ScreenWrapper from "../../components/ScreenWrapper";
import {useAuth} from "../../contexts/AuthContext";
import {fetchNotifications} from "../../services/notificationService";
import {hp, wp} from "../../helpers/common";
import {theme} from "../../constants/theme";
import NotificationItem from "../../components/NotificationItem";
import {useRouter} from "expo-router";
import Header from "../../components/Header";

const Notifications = () => {

    const router = useRouter()

    const [notifications, setNotifications] = useState([])

    const {user} = useAuth()

    useEffect(() => {
        getNotifications()
    }, [])

    const getNotifications = async () => {
        let res = await fetchNotifications(user.id)
        // console.log('notifications',res);
        // console.log('notifications',res.data[0].sender);
        if (res.success) {
            setNotifications(res.data)
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.listStyle}
                    showsVerticalScrollIndicator={false}
                >
                    <Header title='Notifications'/>
                    {
                        notifications.map(item => {
                            return (
                                <NotificationItem
                                    item={item}
                                    key={item?.id}
                                    router={router}
                                />
                            )
                        })
                    }
                    {
                        notifications.length===0 &&(
                            <Text style={styles.noData}>
                                No notifications yet.
                            </Text>
                        )
                    }
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4),
    },
    listStyle: {
        paddingVertical: 20,
        gap: 10,
    },
    noData: {
        fontSize: hp(1.8),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text,
        textAlign: 'center',
    }
})

export default Notifications;
