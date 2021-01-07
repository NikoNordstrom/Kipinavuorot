import React from "react";
import { Pressable, ViewStyle, View, Text, StyleSheet } from "react-native";

import { darkTheme } from "../ts/themes";

interface ButtonProps {
    labelText: string;
    disabled?: boolean;
    style?: ViewStyle;
    onPress: () => void;
}

export default function Button(props: ButtonProps) {
    const { labelText, disabled, style, onPress } = props;

    return (
        <View style={[styles.pressableContainer, { opacity: disabled ? 0.5 : 1 }, style]}>
            <Pressable
                onPress={() => onPress()}
                disabled={disabled}
                android_disableSound={disabled}
                android_ripple={{ color: "rgba(0, 0, 0, 0.25)" }}>
                <View style={styles.button}>
                    <Text style={styles.labelText}>{labelText}</Text>
                </View>
            </Pressable>
        </View>
    );
}

const HEIGHT = 40;

const styles = StyleSheet.create({
    pressableContainer: {
        overflow: "hidden",
        borderRadius: HEIGHT / 2,
        backgroundColor: darkTheme.colors.primary
    },
    button: {
        height: HEIGHT,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: HEIGHT / 2
    },
    labelText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: "Quicksand-Medium"
    }
});