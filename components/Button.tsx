import React from "react";
import { TouchableHighlight, ViewStyle, View, Text, StyleSheet } from "react-native";

interface ButtonProps {
    labelText: string;
    disabled?: boolean;
    style?: ViewStyle;
    onPress?: () => void;
}

export default function Button(props: ButtonProps) {
    const { labelText, disabled, style, onPress } = props;
    return (
        <TouchableHighlight
            disabled={disabled}
            touchSoundDisabled={disabled}
            style={{ ...style, ...styles.highlight, opacity: disabled ? 0.6 : 1 }}
            onPress={onPress}>
            <View style={styles.button}>
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
        borderRadius: height / 2,
        backgroundColor: "mediumseagreen"
    },
    labelText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: "Quicksand-Medium",
        color: "white"
    }
});