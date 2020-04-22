import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function App() {
    return (
        <View style={styles.background}>
            <Text style={styles.heading}>Kipinävuorot</Text>
            <View style={styles.page}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        height: "100%",
        width: "100%",
        padding: 15,
        backgroundColor: "#E4E4E4"
    },
    heading: {
        marginTop: 10,
        marginLeft: 5,
        fontSize: 30,
        fontFamily: "Quicksand-Bold"
    },
    page: {
        marginTop: 15,
        flex: 1,
        borderRadius: 10,
        backgroundColor: "white"
    }
});