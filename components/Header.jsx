import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import BackButton from "./BackButton";
import {hp} from "../helpers/common";
import {theme} from "../constants/theme";

const Header = ({title, showBackButton = true, mb = 10}) => {
    return (
        <View style={[styles.container, {marginBottom: mb}]}>

            {
                showBackButton && (
                    <View style={styles.backButton}>
                        <BackButton/>
                    </View>
                )
            }
            <Text style={styles.title}>{title || ""}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10,
    },
    backButton: {
        position:'absolute',
        left: 0,
    },
    title: {
        fontSize:hp(2.7),
        fWeight: theme.fonts.semibold,
        color: theme.colors.textDark,
    },
})

export default Header;
