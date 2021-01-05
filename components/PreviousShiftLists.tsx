import React from "react";
import { StyleSheet, SectionList, View, Text, Pressable } from "react-native";

import { ShiftList } from "../ts/shift-generator";
import { ShiftListHistory } from "../App";
import { darkTheme } from "../ts/themes";
import { dateFormat, timeFormat, addOpacity } from "../ts/tools";
import Time from "./Time";

interface PreviousShiftListsProps {
    shiftListHistory: ShiftListHistory[];
    viewShiftList: (selectedShiftList: ShiftList) => void;
}

interface ShiftListHistoryItemProps {
    shiftList: ShiftList;
    viewShiftList: (selectedShiftList: ShiftList) => void;
}

function ShiftListHistoryItem(props: ShiftListHistoryItemProps) {
    const { shiftList, viewShiftList } = props;

    const shiftTimeText = `${timeFormat(shiftList.firstShiftStartTime)} - ${timeFormat(shiftList.lastShiftEndTime)}`;
    const shiftDateText = `${shiftList.timestamp ? `${dateFormat(shiftList.timestamp)}` : ""}`;

    return (
        <View style={styles.pressableContainer}>
            <Pressable
                onPress={() => viewShiftList(shiftList)}
                android_disableSound={true}
                android_ripple={{
                    color: addOpacity(darkTheme.colors.text, 0.2)
                }}>
                <View style={styles.item}>
                    <Time timeText={shiftDateText} style={styles.itemTitle} />
                    <Text style={styles.itemInfo}>{shiftList.participants.length} vuoroa ({shiftTimeText})</Text>
                </View>
            </Pressable>
        </View>
    );
}

export default function PreviousShiftLists(props: PreviousShiftListsProps) {
    const { shiftListHistory, viewShiftList } = props;

    const DATA = shiftListHistory.map(({ title, shiftLists, currentlySelected }) => ({
        title,
        data: shiftLists,
        currentlySelected
    }));

    return (
        <View>
            <SectionList
                sections={DATA}
                keyExtractor={({ timestamp }, index) => (
                    timestamp ? timestamp : "" + index
                )}
                renderItem={({ item }) => <ShiftListHistoryItem shiftList={item} viewShiftList={viewShiftList} />}
                renderSectionHeader={({ section: { title, currentlySelected } }) => (
                    <View>
                        <Time
                            timeText={title}
                            fontWeight={"bold"}
                            style={[
                                styles.headerTitle,
                                currentlySelected ? styles.currentlySelectedIndicator : null
                            ]} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    currentlySelectedIndicator: {
        textDecorationLine: "underline"
    },
    headerTitle: {
        alignSelf: "center",
        marginVertical: 5,
        fontFamily: "Quicksand-Bold",
        fontSize: 20,
        color: darkTheme.colors.text
    },
    pressableContainer: {
        marginBottom: 10,
        overflow: "hidden",
        borderRadius: 10
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: darkTheme.colors.border
    },
    itemTitle: {
        fontSize: 15,
        color: darkTheme.colors.text
    },
    itemInfo: {
        color: addOpacity(darkTheme.colors.text, 0.7)
    }
});