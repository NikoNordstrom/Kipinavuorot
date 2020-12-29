import React from "react";
import {
    View, Text,
    TextInput as ReactNativeTextInput,
    TextInputProps as ReactNativeTextInputProps,
    StyleSheet, ViewStyle, TextStyle
} from "react-native";

import { darkTheme } from "../ts/themes";
import { addOpacity } from "../ts/tools";

export interface TextInputProps extends ReactNativeTextInputProps {
    labelText: string;
    ref?: React.RefObject<ReactNativeTextInput>;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const TextInput = React.forwardRef<ReactNativeTextInput, TextInputProps>((props: TextInputProps, ref) => {
    const { labelText, style, textStyle } = props;

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{labelText}</Text>
            <ReactNativeTextInput
                placeholderTextColor={addOpacity(darkTheme.colors.text, 0.6)}
                selectionColor={addOpacity(darkTheme.colors.text, 0.3)}
                {...props}
                ref={ref}
                style={{ ...styles.baseTextInput, ...textStyle }} />
        </View>
    );
});

TextInput.displayName = "TextInput";
export default TextInput;

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