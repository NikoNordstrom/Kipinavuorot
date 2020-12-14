import React from "react";
import { View, Text, TextInput as BaseTextInput, TextInputProps as BaseTextInputProps, StyleSheet, ViewStyle, TextStyle } from "react-native";

import { darkTheme } from "../ts/themes";

export interface TextInputProps extends BaseTextInputProps {
    labelText: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function TextInput(props: TextInputProps) {
    const { labelText, style, textStyle } = props;
    const placeholderTextColor = props.placeholderTextColor || darkTheme.colors.text;

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{labelText}</Text>
            <BaseTextInput
                {...{ ...props, placeholderTextColor }}
                style={{ ...styles.baseTextInput, ...textStyle }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    label: {
        marginLeft: 5,
        marginBottom: 2,
        fontSize: 15,
        fontFamily: "Quicksand-Medium",
        color: darkTheme.colors.text
    },
    baseTextInput: {
        height: 45,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: darkTheme.colors.border,
        backgroundColor: darkTheme.colors.fill,
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        includeFontPadding: false,
        textAlignVertical: "center",
        color: darkTheme.colors.text
    }
});