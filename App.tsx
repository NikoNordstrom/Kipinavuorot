import React, { useState, useEffect, useRef } from "react";
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
import YesNoModal from "./components/YesNoModal";

export interface ShiftTimeTexts {
    firstStart: string;
    lastEnd: string;
}

interface ShiftListHistory {
    currentlySelected: boolean;
    title: string;
    shiftLists: ShiftList[];
}

export interface State {
    shiftList: ShiftList;
    shiftListHistory: ShiftListHistory[];
    shiftListTimesUpdated: boolean;
    shiftListReady: boolean;
    shiftsGenerated: boolean;
    newShiftListModalVisible: boolean;
    header: {
        title: string;
        info: string;
    };
    fetchedState: boolean;
    headerInfoFullHeight: number;
}

function shiftListTimesToString(firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime): ShiftTimeTexts {
    const { hours: startHours, minutes: startMinutes } = firstShiftStartTime;
    const { hours: endHours, minutes: endMinutes } = lastShiftEndTime;

    const firstShiftStartTimeText = `${startHours < 10 ? "0": ""}${startHours}:${startMinutes < 10 ? "0" : ""}${startMinutes}`;
    const lastShiftEndTimeText = `${endHours < 10 ? "0": ""}${endHours}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;

    return {
        firstStart: firstShiftStartTimeText,
        lastEnd: lastShiftEndTimeText
    };
}

export default function App() {
    const emptyShiftList: ShiftList = {
        firstShiftStartTime: { hours: 0, minutes: 0 },
        lastShiftEndTime: { hours: 0, minutes: 0 },
        participants: []
    };

    const [state, setState] = useState<State>({
        shiftList: { ...emptyShiftList },
        shiftListHistory: [{
            currentlySelected: true,
            title: "",
            shiftLists: []
        }],
        shiftListTimesUpdated: false,
        shiftListReady: false,
        shiftsGenerated: false,
        newShiftListModalVisible: false,
        header: {
            title: "Kipinävuorot",
            info: ""
        },
        fetchedState: false,
        headerInfoFullHeight: 0
    });

    const updateState = (newState: State) => {
        newState = {
            ...state,
            ...newState
        };
        AsyncStorage.setItem("state", JSON.stringify(newState));
        setState(newState);
    };

    useEffect(() => {
        AsyncStorage.getItem("state").then((stateStringFromStorage) => {
            const stateFromStorage = stateStringFromStorage ? JSON.parse(stateStringFromStorage) : state;

            updateState({
                ...stateFromStorage,
                fetchedState: true
            });
        });
    }, []);

    const updateShiftListTimes = (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => {
        const shiftListTimeTexts = shiftListTimesToString(
            state.shiftList.firstShiftStartTime,
            state.shiftList.lastShiftEndTime
        );
        const updatedShiftTimeTexts = shiftListTimesToString(firstShiftStartTime, lastShiftEndTime);
        if (
            shiftListTimeTexts.firstStart === updatedShiftTimeTexts.firstStart &&
            shiftListTimeTexts.lastEnd === updatedShiftTimeTexts.lastEnd
        ) return updateState({ ...state, shiftListTimesUpdated: true });

        updateState({
            ...state,
            shiftList: {
                ...state.shiftList,
                firstShiftStartTime,
                lastShiftEndTime
            },
            header: {
                ...state.header,
                info: `${updatedShiftTimeTexts.firstStart} - ${updatedShiftTimeTexts.lastEnd}`
            },
            shiftListTimesUpdated: true
        });
    };

    const updateShiftListParticipants = (shiftParticipants: ShiftParticipant[]) => {
        updateState({
            ...state,
            shiftList: {
                ...state.shiftList,
                participants: shiftParticipants
            }
        });
    };

    const generateNewShifts = (basedOnShiftListHistory?: boolean) => {
        const selectedShiftListHistory = basedOnShiftListHistory
            ? state.shiftListHistory.find(({ currentlySelected }) => currentlySelected)
            : undefined;

        updateState({
            ...state,
            shiftList: generateShifts(
                state.shiftList,
                selectedShiftListHistory ? selectedShiftListHistory.shiftLists : []
            ),
            shiftsGenerated: true
        });
    };

    const createNewShiftList = (usePreviousShiftList: boolean) => {
        const newShiftListHistory = [...state.shiftListHistory];

        // Add shiftList to newShiftListHistory
        const selectedShiftListHistoryIndex = newShiftListHistory.findIndex(({ currentlySelected }) => currentlySelected);

        if (!usePreviousShiftList) {
            newShiftListHistory.forEach(({ currentlySelected }, index) => {
                if (currentlySelected) newShiftListHistory[index].currentlySelected = false;
            });
        }

        if (selectedShiftListHistoryIndex > -1) {
            newShiftListHistory[selectedShiftListHistoryIndex].shiftLists.unshift(state.shiftList);
        }

        if (selectedShiftListHistoryIndex === -1 || !usePreviousShiftList) {
            const shiftListDate = new Date(Date.parse(state.shiftList.shiftsGeneratedTimestamp || Date.now().toString()));

            newShiftListHistory.unshift({
                currentlySelected: true,
                title: shiftListDate.toDateString(),
                shiftLists: [state.shiftList]
            });
        }

        const emptyShiftTime = { hours: 0, minutes: 0 };

        // Create new shiftList
        const newShiftList: ShiftList = {
            ...state.shiftList,
            firstShiftStartTime: emptyShiftTime,
            lastShiftEndTime: emptyShiftTime,
            participants: usePreviousShiftList
                ? state.shiftList.participants.map((shiftParticipant): ShiftParticipant => ({
                    ...shiftParticipant,
                    shiftStartTime: emptyShiftTime,
                    shiftEndTime: emptyShiftTime
                }))
                : [],
            shiftsGeneratedTimestamp: undefined
        };

        updateState({
            ...state,
            shiftList: newShiftList,
            shiftListHistory: newShiftListHistory,
            shiftListTimesUpdated: false,
            shiftListReady: false,
            shiftsGenerated: false,
            newShiftListModalVisible: false
        });
    };
    
    const headerInfoRef = useRef<Text>(null);

    return !state.fetchedState ? null : (
        <View style={styles.background}>
            {
                ["\n", state.shiftListHistory.map(({ shiftLists }) => shiftLists)].forEach(v => console.log(v))
            }
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{state.header.title}</Text>
                {
                    state.shiftListTimesUpdated
                        ? <Text
                            style={styles.headerInfo}
                            onLayout={({ nativeEvent }) => {
                                if (state.shiftListTimesUpdated !== false && state.headerInfoFullHeight !== 0) return;
                                updateState({
                                    ...state,
                                    headerInfoFullHeight: nativeEvent.layout.height
                                });
                            }}
                            ref={headerInfoRef}>{state.header.info}</Text>
                        : null
                }
            </View>

            <YesNoModal
                visible={state.newShiftListModalVisible}
                title="Uusi lista"
                text="Tuleeko uuteen listaan samat osallistujat?"
                onYes={() => createNewShiftList(true)}
                onNo={() => createNewShiftList(false)} />

            <ViewPager
                style={styles.viewPager}
                headerInfoRef={headerInfoRef}
                headerInfoFullHeight={state.headerInfoFullHeight}>
                <View key="1">
                    {
                        !state.shiftListReady && !state.shiftListTimesUpdated
                            ? <UpdateShiftListTimes
                                shiftList={state.shiftList}
                                firstStartDefaultText={state.header.info.length === 13 ? state.header.info.substring(0, 5) : undefined}
                                lastEndDefaultText={state.header.info.length === 13 ? state.header.info.substring(8, 13) : undefined}
                                updateShiftListTimes={updateShiftListTimes}
                                shiftListTimesToString={shiftListTimesToString}
                                style={{ marginBottom: 15 }} />
                            : null
                    }
                    {
                        !state.shiftListReady && state.shiftListTimesUpdated
                            ? <AddShiftParticipant
                                shiftList={state.shiftList}
                                updateShiftListParticipants={updateShiftListParticipants}
                                setShiftListReady={() => updateState({ ...state, shiftListReady: true })}
                                style={{ marginBottom: 15 }} />
                            : null
                    }
                    {
                        state.shiftList.participants.length > 0
                            ? <FlatShiftList {...state.shiftList} style={{ flex: 1 }} /> : null
                    }
                    {
                        state.shiftListReady
                            ? <View style={styles.newShiftsButtonContainer}>
                                <Button
                                    style={{ flex: 1, marginRight: 15 }}
                                    labelText="Uusi lista"
                                    disabled={!state.shiftsGenerated}
                                    onPress={() => updateState({ ...state, newShiftListModalVisible: true })} />
                                <Button
                                    style={{ flex: 1 }}
                                    labelText="Jaa vuorot"
                                    disabled={state.shiftsGenerated}
                                    onPress={generateNewShifts} />
                            </View>
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
    header: {
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 25,
        includeFontPadding: false,
        fontFamily: "Quicksand-Bold"
    },
    headerInfo: {
        height: 25,
        fontSize: 20,
        includeFontPadding: false,
        fontFamily: "Quicksand-Medium"
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
    },
    newShiftsButtonContainer: {
        flexDirection: "row"
    }
});