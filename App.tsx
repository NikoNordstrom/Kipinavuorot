import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ShiftList } from "./shift-generator";
import FlatShiftList from "./components/FlatShiftList";

export default function App() {
    const initialShiftList: ShiftList = {
        firstShiftStartTime: { hours: -1, minutes: -1 },
        lastShiftEndTime: { hours: -1, minutes: -1 },
        participants: []
    };
    const [shiftList, setShiftList] = useState(initialShiftList);
    useEffect(() => {
        AsyncStorage.getItem("shiftlist").then((shiftListStringFromStorage) => {
            if (!shiftListStringFromStorage) return;
            setShiftList(JSON.parse(shiftListStringFromStorage));
        });
    }, []);
    console.log(shiftList);
    return (
        <View style={styles.background}>
            <Text style={styles.heading}>Kipinävuorot</Text>
            <View style={styles.page}>
                {
                    shiftList && shiftList.participants.length > 0
                        ? <FlatShiftList {...shiftList} />
                        : null
                }
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