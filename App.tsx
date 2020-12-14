import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, BackHandler, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import generateShifts, {
    ShiftList,
    ShiftTime,
    ShiftParticipant
} from "./ts/shift-generator";
import { darkTheme } from "./ts/themes";
import { dateFormat, timeFormat } from "./ts/tools";

import ViewPager from "./components/ViewPager";
import FlatShiftList from "./components/FlatShiftList";
import UpdateShiftListTimes from "./components/UpdateShiftListTimes";
import AddShiftParticipant from "./components/AddShiftParticipant";
import Button from "./components/Button";
import YesNoModal from "./components/YesNoModal";
import PreviousShiftLists from "./components/PreviousShiftLists";
import Time from "./components/Time";


export interface ShiftTimeTexts {
    firstStart: string;
    lastEnd: string;
}

export interface ShiftListHistory {
    currentlySelected: boolean;
    title: string;
    shiftLists: ShiftList[];
}

export interface State {
    shiftList: ShiftList;
    shiftListHistory: ShiftListHistory[];
    shiftListTimesUpdated: boolean;
    shiftListReady: boolean;
    generatingNewShifts: boolean;
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
    return {
        firstStart: timeFormat(firstShiftStartTime),
        lastEnd: timeFormat(lastShiftEndTime)
    };
}

export default function App() {
    const emptyShiftList: ShiftList = {
        firstShiftStartTime: { hours: 0, minutes: 0 },
        lastShiftEndTime: { hours: 0, minutes: 0 },
        participants: [],
        shiftedNumber: 0
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
        generatingNewShifts: false,
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

        console.log("STATE UPDATED!");
        if (JSON.stringify(state.shiftListHistory) !== JSON.stringify(newState.shiftListHistory)) console.log("SHIFTLIST HISTORY UPDATED: " + JSON.stringify(
            newState.shiftListHistory.map(({ shiftLists }) => shiftLists.map(({ participants, shiftedNumber }) => [...participants.map(({ name }) => name), shiftedNumber])))
        );

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

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if (state.shiftListReady) {
                updateState({ ...state, shiftListReady: false });
                return true;
            }
            else if (state.shiftListTimesUpdated) {
                updateState({
                    ...state,
                    shiftListTimesUpdated: false,
                    shiftList: {
                        firstShiftStartTime: emptyShiftList.firstShiftStartTime,
                        lastShiftEndTime: emptyShiftList.lastShiftEndTime,
                        participants: state.shiftList.participants,
                        shiftedNumber: 0
                    }
                });
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    });

    useEffect(() => {
        if (state.generatingNewShifts) generateNewShifts();
    }, [state.generatingNewShifts]);

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

    const generateNewShifts = () => {
        const selectedShiftListHistoryIndex = state.shiftListHistory.findIndex(({ currentlySelected }) => currentlySelected);

        const shiftListHistory: ShiftList[] = selectedShiftListHistoryIndex > -1
            ? JSON.parse(JSON.stringify(state.shiftListHistory[selectedShiftListHistoryIndex].shiftLists)).reverse()
            : [];

        const newShiftList = generateShifts(state.shiftList, shiftListHistory);

        setTimeout(() => updateState({
            ...state,
            shiftList: newShiftList,
            generatingNewShifts: false,
            shiftsGenerated: true
        }), 200);
    };

    const createNewShiftList = (usePreviousShiftList: boolean) => {
        const newShiftListHistory: ShiftListHistory[] = JSON.parse(JSON.stringify(state.shiftListHistory));

        const selectedShiftListHistoryIndex = newShiftListHistory.findIndex(({ currentlySelected }) => currentlySelected);

        const nowWithOffset = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;

        if (selectedShiftListHistoryIndex > -1) {
            newShiftListHistory[selectedShiftListHistoryIndex].shiftLists.unshift(state.shiftList);

            if (newShiftListHistory[selectedShiftListHistoryIndex].title === "") {
                newShiftListHistory[selectedShiftListHistoryIndex].title = dateFormat(nowWithOffset);
            }

            if (!usePreviousShiftList) {
                newShiftListHistory[selectedShiftListHistoryIndex].currentlySelected = false;

                if (newShiftListHistory[selectedShiftListHistoryIndex].title !== dateFormat(nowWithOffset)) {
                    newShiftListHistory[selectedShiftListHistoryIndex].title += ` - ${dateFormat(nowWithOffset)}`;
                }
            }
        }
        
        if (selectedShiftListHistoryIndex === -1) {
            const shiftListDateString = state.shiftList.timestamp
                ? dateFormat(state.shiftList.timestamp)
                : dateFormat(nowWithOffset);

            newShiftListHistory.unshift({
                currentlySelected: true,
                title: `${shiftListDateString}`,
                shiftLists: [state.shiftList]
            });
        }

        const emptyShiftTime: ShiftTime = { hours: 0, minutes: 0 };

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
            timestamp: undefined
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
            <StatusBar backgroundColor={darkTheme.colors.background} />
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
                onNo={() => createNewShiftList(false)}
                onRequestClose={() => updateState({ ...state, newShiftListModalVisible: false })} />

            <ViewPager
                style={styles.viewPager}
                headerInfoRef={headerInfoRef}
                headerInfoFullHeight={state.headerInfoFullHeight}>
                <View key="Nykyinen" style={styles.page}>
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
                        state.generatingNewShifts ? <View style={styles.activityIndicatorContainer}>
                            <ActivityIndicator color={darkTheme.colors.primary} size="large" />
                        </View> : null
                    }
                    {
                        state.shiftList.participants.length > 0 && !state.generatingNewShifts
                            ? <FlatShiftList {...state.shiftList} style={{ flex: 1 }} /> : null
                    }
                    {
                        state.shiftListReady && !state.generatingNewShifts
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
                                    onPress={() => updateState({ ...state, generatingNewShifts: true })} />
                            </View>
                            : null
                    }
                </View>
                <View key="Aiemmat" style={styles.page}>
                    {
                        state.shiftListHistory.length > 0 && state.shiftListHistory[0].shiftLists.length > 0
                            ? <PreviousShiftLists shiftListHistory={state.shiftListHistory} />
                            : <Text style={styles.noPreviousShiftListsFound}>Aiempia kipinävuoroja ei löytynyt.</Text>
                    }
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
        paddingTop: 0,
        backgroundColor: darkTheme.colors.background
    },
    header: {
        marginTop: 15,
        marginLeft: 5,
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 25,
        includeFontPadding: false,
        fontFamily: "Quicksand-Bold",
        color: darkTheme.colors.text
    },
    headerInfo: {
        height: 25,
        fontSize: 20,
        fontFamily: "Nunito-SemiBold",
        includeFontPadding: false,
        color: darkTheme.colors.text
    },
    viewPager: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: darkTheme.colors.card
    },
    page: {
        padding: 15,
        paddingTop: 0
    },
    noPreviousShiftListsFound: {
        flex: 1,
        marginTop: "40%",
        textAlign: "center",
        opacity: 0.4,
        fontSize: 25,
        fontFamily: "Quicksand-Regular",
        color: darkTheme.colors.text
    },
    newShiftsButtonContainer: {
        flexDirection: "row",
        marginTop: 15
    },
    activityIndicatorContainer: {
        marginBottom: "40%",
        flex: 1,
        justifyContent: "center"
    }
});