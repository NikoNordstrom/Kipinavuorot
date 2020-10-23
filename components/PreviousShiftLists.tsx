import React from "react";
import { StyleSheet, SectionList, View, Text } from "react-native";

import { ShiftList } from "../shift-generator";
import { ShiftListHistory } from "../App";

interface PreviousShiftListsProps {
    shiftListHistory: ShiftListHistory[];
}

interface ShiftListHistoryItemProps {
    shiftList: ShiftList;
}

function ShiftListHistoryItem(props: ShiftListHistoryItemProps) {
    const { shiftList } = props;

    return (
        <View style={styles.shiftListHistoryItem}>
            <Text>{shiftList.shiftsGeneratedTimestamp}</Text>
            <Text>{shiftList.participants.length} osallistujaa</Text>
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
        <View style={styles.container}>
            <SectionList
                sections={DATA}
                keyExtractor={({ shiftsGeneratedTimestamp }, index) => (
                    shiftsGeneratedTimestamp ? shiftsGeneratedTimestamp : "" + index
                )}
                renderItem={({ item }) => <ShiftListHistoryItem shiftList={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View>
                        <Text>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    shiftListHistoryItem: {
        width: "100%",
        padding: 15
    }
});