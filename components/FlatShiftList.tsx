import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, Text, View, ViewStyle, ScrollView } from "react-native";

import { ShiftTime, ShiftParticipant, ShiftList } from "../src/shift-generator";
import { darkTheme } from "../src/themes";

interface FlatShiftListProps extends ShiftList {
    style?: ViewStyle;
}

function ShiftListItem(participant: ShiftParticipant) {
    const { name, shiftStartTime, shiftEndTime } = participant;

    const shiftTimeToString = (shiftTimeObject: ShiftTime) => {
        const { hours, minutes } = shiftTimeObject;
        if (hours === -1 && minutes === -1) return "00:00";
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    };

    return (
        <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemTime}>{shiftTimeToString(shiftStartTime)}</Text>
            <Text style={styles.listItemTime}>{shiftTimeToString(shiftEndTime)}</Text>
            <ScrollView>
                <Text style={styles.listItemName}>{name}</Text>
            </ScrollView>
        </TouchableOpacity>
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
                        <Text style={[styles.listItemTime, styles.headerItem]}>Alkaa</Text>
                        <Text style={[styles.listItemTime, styles.headerItem]}>Päättyy</Text>
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
    listItem: {
        flexDirection: "row",
        paddingVertical: 7.5,
        borderBottomWidth: 1,
        borderBottomColor: darkTheme.colors.border
    },
    listItemTime: {
        flexBasis: "17.5%",
        marginRight: 10,
        fontSize: 20,
        fontFamily: "Quicksand-Medium",
        color: darkTheme.colors.text
    },
    listItemName: {
        fontSize: 20,
        fontFamily: "Quicksand-Regular",
        color: darkTheme.colors.text
    }
});