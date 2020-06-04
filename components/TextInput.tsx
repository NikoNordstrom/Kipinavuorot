import React from "react";
import { View, Text, TextInput as BaseTextInput, StyleSheet, ViewStyle } from "react-native";

export interface TextInputProps {
    labelText: string;
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    style?: ViewStyle;
    editable?: boolean;
    maxLength?: number;
    selectTextOnFocus?: boolean;
    onChangeText?: (text: string) => void;
}

export default function TextInput(props: TextInputProps) {
    const {
        labelText,
        value,
        placeholder,
        defaultValue,
        style,
        editable,
        maxLength,
        selectTextOnFocus,
        onChangeText
    } = props;

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{labelText}</Text>
            <BaseTextInput
                style={styles.baseTextInput}
                value={value}
                placeholder={placeholder}
                defaultValue={defaultValue}
                autoCorrect={false}
                autoCompleteType="name"
                editable={editable}
                maxLength={maxLength}
                selectTextOnFocus={selectTextOnFocus}
                onChangeText={onChangeText} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    label: {
        marginLeft: 5,
        marginBottom: 1,
        fontSize: 15,
        fontFamily: "Quicksand-Medium"
    },
    baseTextInput: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        includeFontPadding: false,
        textAlignVertical: "center"
    }
});