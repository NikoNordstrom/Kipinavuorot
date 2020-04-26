import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { ShiftList, ShiftTime } from "./shift-generator";
import FlatShiftList from "./components/FlatShiftList";
import ShiftListUpdateTools from "./components/ShiftListUpdateTools";

const initialShiftList: ShiftList = {
    firstShiftStartTime: { hours: 0, minutes: 0 },
    lastShiftEndTime: { hours: 0, minutes: 0 },
    participants: []
};

export default function App() {
    const [shiftList, setShiftList] = useState(initialShiftList);
    useEffect(() => {
        AsyncStorage.getItem("shiftlist").then((shiftListStringFromStorage) => {
            if (!shiftListStringFromStorage) return;
            setShiftList(JSON.parse(shiftListStringFromStorage));
        });
    }, []);
    useEffect(() => {
        AsyncStorage.setItem("shiftlist", JSON.stringify(shiftList));
    });
    const updateShiftListTimes = (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => {
        if (
            JSON.stringify(shiftList.firstShiftStartTime) === JSON.stringify(firstShiftStartTime) &&
            JSON.stringify(shiftList.lastShiftEndTime) === JSON.stringify(lastShiftEndTime)
        ) return;
        setShiftList({
            ...shiftList,
            firstShiftStartTime,
            lastShiftEndTime
        });
    };
    const { hours: startHours, minutes: startMinutes } = shiftList.firstShiftStartTime;
    const firstShiftStartTimeText = `${startHours < 10 ? "0": ""}${startHours}:${startMinutes < 10 ? "0" : ""}${startMinutes}`;
    const { hours: endHours, minutes: endMinutes } = shiftList.lastShiftEndTime;
    const lastShiftEndTimeText = `${endHours < 10 ? "0": ""}${endHours}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
    return (
        <View style={styles.background}>
            {console.log(shiftList)}
            <Text style={styles.heading}>Kipinävuorot</Text>
            <View style={styles.page}>
                {
                    shiftList && shiftList.participants.length > 0
                        ? <FlatShiftList {...shiftList} />
                        : <ShiftListUpdateTools
                            defaultStartTimeText={firstShiftStartTimeText}
                            defaultEndTimeText={lastShiftEndTimeText}
                            updateShiftListTimes={updateShiftListTimes} />
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