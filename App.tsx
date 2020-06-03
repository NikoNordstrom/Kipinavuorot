import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import generateShifts, {
    ShiftList,
    ShiftTime,
    ShiftParticipant
} from "./shift-generator";

import ViewPager from "./components/ViewPager";
import FlatShiftList from "./components/FlatShiftList";
import UpdateShiftListTimes from "./components/UpdateShiftListTimes";
import AddShiftParticipant from "./components/AddShiftParticipant";
import Button from "./components/Button";

export default function App() {
    const emptyShiftList: ShiftList = {
        firstShiftStartTime: { hours: 0, minutes: 0 },
        lastShiftEndTime: { hours: 0, minutes: 0 },
        participants: []
    };

    const [shiftList, setShiftList] = useState(emptyShiftList);
    const [shiftListTimesUpdated, setShiftListTimesUpdated] = useState(false);
    const [shiftListReady, setShiftListReady] = useState(false);

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

    const updateShiftList = () => {
        setShiftList(generateShifts(shiftList));
    };

    return (
        <View style={styles.background}>
            {
                [shiftList, "\n"].forEach(v => console.log(v))
            }
            <Text style={styles.heading}>Kipinävuorot</Text>
            <ViewPager style={styles.viewPager}>
                <View key="1">
                    {
                        !shiftListReady
                            ? <UpdateShiftListTimes
                                shiftList={shiftList}
                                updateShiftListTimes={updateShiftListTimes}
                                style={{ marginBottom: 15 }} />
                            : null
                    }
                    {
                        !shiftListReady && shiftListTimesUpdated
                            ? <AddShiftParticipant
                                shiftList={shiftList}
                                updateShiftListParticipants={updateShiftListParticipants}
                                setShiftListReady={() => setShiftListReady(true)}
                                style={{ marginBottom: 15 }} />
                            : null
                    }
                    {
                        shiftList && shiftList.participants.length > 0
                            ? <FlatShiftList {...shiftList} /> : null
                    }
                    {
                        shiftListReady
                            ? <Button
                                labelText="Luo kipinävuorot"
                                onPress={updateShiftList} />
                            : null
                    }
                </View>
                <View key="2" style={{ flex: 1 }}>
                    <Text style={styles.noPreviousShiftListsFound}>Aiempia kipinävuoroja ei löytynyt.</Text>
                </View>
            </ViewPager>
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
        marginBottom: 10,
        fontSize: 25,
        fontFamily: "Quicksand-Bold"
    },
    viewPager: {
        padding: 15,
        paddingTop: 0,
        flex: 1,
        borderRadius: 10,
        backgroundColor: "white"
    },
    noPreviousShiftListsFound: {
        flex: 1,
        marginTop: "40%",
        textAlign: "center",
        opacity: 0.3,
        fontSize: 25,
        fontFamily: "Quicksand-Regular"
    }
});