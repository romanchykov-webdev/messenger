import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {theme} from "../constants/theme";

const RichTextEditor = ({editorRef, onChange}) => {
    return (
        <View style={{minHeight: 285}}>
            <RichToolbar
                actions={[
                    actions.insertImage,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.keyboard,
                    actions.setStrikethrough,
                    actions.setUnderline,
                    actions.removeFormat,
                    actions.insertVideo,
                    actions.checkboxList,
                    actions.undo,
                    actions.redo,
                //     my action no standartise
                    actions.heading1,
                    actions.heading4,

                ]}

                iconMap={{
                    [actions.heading1]:({tintColor}) => <Text style={{color:tintColor}}>H1</Text>,
                    [actions.heading4]:({tintColor}) => <Text style={{color:tintColor}}>H4</Text>,
                }} //for get icon h1 h4
                style={styles.richBar}
                flatContainerStyle={styles.flatStyle}
                selectedIconTint={theme.colors.primaryDark} // for action
                // editorRef={editorRef}
                getEditor={() => editorRef.current}
                disabled={false}
            />

        {/*    editor*/}
            <RichEditor
                ref={editorRef}
                containerStyle={styles.rich}
                editorStyle={styles.contentStyle}
                placeholder={"What`s on your mind?"}
                onChange={onChange}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    richBar:{
        borderTopRightRadius:theme.radius.xl,
        borderTopLeftRadius:theme.radius.xl,
        backgroundColor:theme.colors.gray,
    },
    rich:{
        minHeight:240,
        flex:1,
        borderWidth:1.5,
        borderTopWidth:0,
        borderBottomRightRadius:theme.radius.xl,
        borderBottomLeftRadius:theme.radius.xl,
        borderColor:theme.colors.gray,
        padding:5

    },
    contentStyle:{
        color:theme.colors.text,
        placeholderColor:'gray',

    },
    flatStyle:{
        paddingHorizontal:8,
        gap:3
    }
})

export default RichTextEditor;
