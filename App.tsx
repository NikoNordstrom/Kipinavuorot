import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { shiftList } from "./shift-generator";
import ShiftList from "./components/ShiftList";

export default function App() {
    const testShiftList: shiftList = {
        firstShiftStartTime: {
            hours: 21,
            minutes: 0
        },
        lastShiftEndTime: {
            hours: 3,
            minutes: 0
        },
        participants: [
            {
                name: "Nordström",
                shiftStartTime: { hours: 21, minutes: 0 },
                shiftEndTime: { hours: 22, minutes: 0 }
            },
            {
                name: "Tuominen",
                shiftStartTime: { hours: 22, minutes: 0 },
                shiftEndTime: { hours: 23, minutes: 0 }
            }
        ]
    };
    const [shiftList, updateShiftList] = useState(testShiftList);
    return (
        <View style={styles.background}>
            <Text style={styles.heading}>Kipinävuorot</Text>
            <View style={styles.page}>
                <ShiftList {...shiftList} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        height: "100%",
        width: "100%",
        padding: 15,
        backgroundColor: "#E8E8E8"
    },
    heading: {
        marginTop: 10,
        marginLeft: 5,
        fontSize: 30,
        fontFamily: "Quicksand-Bold"
    },
    page: {
        marginTop: 15,
        padding: 15,
        flex: 1,
        borderRadius: 10,
        backgroundColor: "white"
    }
});