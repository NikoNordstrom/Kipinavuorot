import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, Text, View, ScrollView } from "react-native";
import { shiftTime, shiftParticipant, shiftList } from "../shift-generator";

function ShiftListItem(participant: shiftParticipant) {
    const { name, shiftStartTime, shiftEndTime } = participant;
    const shiftTimeToString = (shiftTime: shiftTime) => {
        const { hours, minutes } = shiftTime;
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

export default function ShiftList(props: shiftList) {
    const { participants } = props;
    return (
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
                    <Text style={styles.headerItem}>Osallistuja</Text>
                </View>
            } />
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row"
    },
    headerItem: {
        fontSize: 15,
        fontFamily: "Quicksand-Medium"
    },
    listItem: {
        flexDirection: "row",
        paddingVertical: 7.5,
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC"
    },
    listItemTime: {
        flexBasis: "17.5%",
        marginRight: 10,
        fontSize: 20,
        fontFamily: "Quicksand-Medium"
    },
    listItemName: {
        fontSize: 20,
        fontFamily: "Quicksand-Regular"
    }
});