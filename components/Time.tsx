import React from "react";
import { Text, StyleSheet, TextProps as BaseTextProps } from "react-native";

import { darkTheme } from "../ts/themes";

export interface TimeProps extends BaseTextProps {
    timeText: string;
    fontWeight?: "regular" | "medium" | "bold";
}

export default function Time(props: TimeProps) {
    const { timeText, style, fontWeight } = props;

    const fontFamily = fontWeight ? {
        "regular": "Nunito-Regular",
        "medium": "Nunito-SemiBold",
        "bold": "Nunito-Bold"
    }[fontWeight] : styles.time.fontFamily;

    return (
        <Text style={[styles.time, style, { fontFamily }]}>{timeText}</Text>
    );
}

const styles = StyleSheet.create({
    time: {
        fontSize: 20,
        fontFamily: "Nunito-SemiBold",
        includeFontPadding: false,
        color: darkTheme.colors.text
    }
});