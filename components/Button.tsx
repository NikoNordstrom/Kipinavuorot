import React from "react";
import { TouchableHighlight, ViewStyle, View, Text, StyleSheet } from "react-native";

import { darkTheme } from "../src/themes";

interface ButtonProps {
    labelText: string;
    disabled?: boolean;
    color?: "green" | "red";
    style?: ViewStyle;
    onPress?: () => void;
}

export default function Button(props: ButtonProps) {
    const { labelText, disabled, color, style, onPress } = props;

    return (
        <TouchableHighlight
            disabled={disabled}
            touchSoundDisabled={disabled}
            style={{ ...style, ...styles.highlight, opacity: disabled ? 0.5 : 1 }}
            onPress={onPress}>
            <View style={[{ backgroundColor: color === "red" ? "#e63946" : darkTheme.colors.primary }, styles.button]}>
                <Text style={styles.labelText}>{labelText}</Text>
            </View>
        </TouchableHighlight>
    );
}

const height = 40;

const styles = StyleSheet.create({
    highlight: {
        borderRadius: height / 2
    },
    button: {
        height,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: height / 2
    },
    labelText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: "Quicksand-Medium"
    }
});