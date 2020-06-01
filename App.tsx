import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { ShiftList, ShiftTime, ShiftParticipant } from "./shift-generator";
import FlatShiftList from "./components/FlatShiftList";
import UpdateShiftListTimes from "./components/UpdateShiftListTimes";
import AddShiftParticipant from "./components/AddShiftParticipant";

export default function App() {
    const emptyShiftList: ShiftList = {
        firstShiftStartTime: { hours: 0, minutes: 0 },
        lastShiftEndTime: { hours: 0, minutes: 0 },
        participants: []
    };

    const [shiftList, setShiftList] = useState(emptyShiftList);
    const [shiftListTimesUpdated, setShiftListTimesUpdated] = useState(false);

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
        setShiftListTimesUpdated(true);
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

    const updateShiftListParticipants = (shiftParticipants: ShiftParticipant[]) => {
        setShiftList({ ...shiftList, participants: shiftParticipants });
    };

    return (
        <View style={styles.background}>
            {console.log(shiftList)}
            <Text style={styles.heading}>Kipinävuorot</Text>
            <View style={styles.page}>
                <UpdateShiftListTimes
                    shiftList={shiftList}
                    updateShiftListTimes={updateShiftListTimes}
                    style={{ marginBottom: 15 }} />
                {
                    shiftListTimesUpdated
                        ? <AddShiftParticipant
                            shiftList={shiftList}
                            updateShiftListParticipants={updateShiftListParticipants}
                            style={{ marginBottom: 15 }} />
                        : null
                }
                {
                    shiftList && shiftList.participants.length > 0
                        ? <FlatShiftList {...shiftList} /> : null
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