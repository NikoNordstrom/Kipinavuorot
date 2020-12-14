import React from "react";
import { StyleSheet, SectionList, View, Text } from "react-native";

import { ShiftList } from "../ts/shift-generator";
import { ShiftListHistory } from "../App";
import { darkTheme } from "../ts/themes";
import { dateFormat, timeFormat } from "../ts/tools";

interface PreviousShiftListsProps {
    shiftListHistory: ShiftListHistory[];
}

interface ShiftListHistoryItemProps {
    shiftList: ShiftList;
}

function ShiftListHistoryItem(props: ShiftListHistoryItemProps) {
    const { shiftList } = props;

    const shiftTimeText = `${timeFormat(shiftList.firstShiftStartTime)} - ${timeFormat(shiftList.lastShiftEndTime)}`;

    return (
        <View style={styles.item}>
            <Text style={styles.itemTitle}>{`${shiftTimeText}${shiftList.timestamp ? ` (${dateFormat(shiftList.timestamp)})` : ""}`}</Text>
            <Text style={styles.itemInfo}>{shiftList.participants.length} osallistujaa</Text>
        </View>
    );
}

export default function PreviousShiftLists(props: PreviousShiftListsProps) {
    const { shiftListHistory } = props;

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
                renderItem={({ item }) => <ShiftListHistoryItem shiftList={item} />}
                renderSectionHeader={({ section: { title, currentlySelected } }) => (
                    <View>
                        <Text style={[styles.headerTitle, currentlySelected ? styles.currentlySelectedIndicator : null]}>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        marginVertical: 5,
        fontFamily: "Quicksand-Bold",
        fontSize: 17.5,
        color: darkTheme.colors.text
    },
    currentlySelectedIndicator: {
        textDecorationLine: "underline"
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderLeftWidth: 1,
        borderColor: darkTheme.colors.text
    },
    itemTitle: {
        color: darkTheme.colors.text
    },
    itemInfo: {
        color: darkTheme.colors.text
    }
});