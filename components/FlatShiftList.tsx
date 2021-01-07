import React from "react";
import { StyleSheet, FlatList, Text, View, ViewStyle, ScrollView } from "react-native";

import { ShiftParticipant, ShiftList } from "../ts/shift-generator";
import { darkTheme } from "../ts/themes";
import { timeFormat } from "../ts/tools";
import Time from "./Time";

interface FlatShiftListProps extends ShiftList {
    style?: ViewStyle;
}

function ShiftListItem(participant: ShiftParticipant) {
    const { name, shiftStartTime, shiftEndTime } = participant;

    return (
        <View style={styles.listItem}>
            <Time timeText={timeFormat(shiftStartTime)} style={styles.firstTwoColumns} />
            <Time timeText={timeFormat(shiftEndTime)} style={styles.firstTwoColumns} />
            <ScrollView>
                <Text style={styles.listItemName}>{name}</Text>
            </ScrollView>
        </View>
    );
}

export default function FlatShiftList(props: FlatShiftListProps) {
    const { participants, style } = props;

    return (
        <View style={style}>
            <FlatList
                data={participants}
                renderItem={({ item: participant }) => {
                    return ShiftListItem(participant);
                }}
                keyExtractor={({ name }, index) => `${name}${index}`}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={[styles.firstTwoColumns, styles.headerItem]}>Alkaa</Text>
                        <Text style={[styles.firstTwoColumns, styles.headerItem]}>Päättyy</Text>
                        <Text style={styles.headerItem}>Nimi</Text>
                    </View>
                } />
        </View>
        
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row"
    },
    headerItem: {
        fontSize: 15,
        fontFamily: "Quicksand-Medium",
        color: darkTheme.colors.text
    },
    firstTwoColumns: {
        width: "18%",
        minWidth: 60,
        marginRight: 10
    },
    listItem: {
        flexDirection: "row",
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: darkTheme.colors.border
    },
    listItemName: {
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        includeFontPadding: false,
        color: darkTheme.colors.text
    }
});