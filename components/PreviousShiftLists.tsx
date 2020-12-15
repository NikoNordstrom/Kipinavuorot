import React from "react";
import { StyleSheet, SectionList, View, Text } from "react-native";

import { ShiftList } from "../ts/shift-generator";
import { ShiftListHistory } from "../App";
import { darkTheme } from "../ts/themes";
import { dateFormat, timeFormat, addOpacity } from "../ts/tools";
import Time from "./Time";

interface PreviousShiftListsProps {
    shiftListHistory: ShiftListHistory[];
}

interface ShiftListHistoryItemProps {
    shiftList: ShiftList;
}

function ShiftListHistoryItem(props: ShiftListHistoryItemProps) {
    const { shiftList } = props;

    const shiftTimeText = `${timeFormat(shiftList.firstShiftStartTime)} - ${timeFormat(shiftList.lastShiftEndTime)}`;
    const shiftDateText = `${shiftList.timestamp ? ` (${dateFormat(shiftList.timestamp)})` : ""}`;

    return (
        <View style={styles.item}>
            <Time timeText={`${shiftTimeText}${shiftDateText}`} style={styles.itemTitle} />
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
        marginVertical: 5,
        fontFamily: "Quicksand-Bold",
        fontSize: 17.5,
        color: darkTheme.colors.text
    },
    item: {
        marginBottom: 10,
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