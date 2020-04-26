import React from "react";
import { TouchableHighlight, View, Text, StyleSheet } from "react-native";

interface ButtonProps {
    labelText: string;
    onPress?: () => void;
}

export default function Button(props: ButtonProps) {
    const { labelText, onPress } = props;
    return (
        <TouchableHighlight
            style={styles.highlight}
            onPress={onPress}>
            <View style={styles.button}>
                <Text style={styles.labelText}>{labelText}</Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    highlight: {
        borderRadius: 45 / 2
    },
    button: {
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 45 / 2,
        backgroundColor: "mediumseagreen"
    },
    labelText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: "Quicksand-Medium",
        color: "white"
    }
});