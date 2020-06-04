import React, { useState } from "react";
import { View, ViewStyle, Text, StyleSheet } from "react-native";
import TextInput, { TextInputProps } from "./TextInput";
import Button from "./Button";
import { ShiftList, ShiftTime } from "../shift-generator";
import { ShiftTimeTexts } from "../App";

interface UpdateShiftListTimesProps {
    shiftList: ShiftList;
    updateShiftListTimes: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => void;
    shiftListTimesToString: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => ShiftTimeTexts;
    style?: ViewStyle;
}

export default function UpdateShiftListTimes(props: UpdateShiftListTimesProps) {
    const { shiftList, updateShiftListTimes, shiftListTimesToString, style } = props;
    const defaultTimeText = "00:00";

    const shiftListTimeTexts = shiftListTimesToString(shiftList.firstShiftStartTime, shiftList.lastShiftEndTime);

    const [shiftTimeTexts, setShiftTimeTexts] = useState({
        ...shiftListTimeTexts,
        initialValuesUpdated: false
    });
    const [done, setDone] = useState(false);

    const shiftTimesAlreadySet = (
        shiftListTimeTexts.firstStart !== defaultTimeText &&
        shiftListTimeTexts.lastEnd !== defaultTimeText
    );

    if (shiftTimesAlreadySet && !shiftTimeTexts.initialValuesUpdated) {
        setShiftTimeTexts({
            ...shiftListTimeTexts,
            initialValuesUpdated: true
        });
        setDone(true);
    }

    if (done) {
        const [startHours, startMinutes] = shiftTimeTexts.firstStart.split(":").map(text => Number.parseInt(text));
        const [endHours, endMinutes] = shiftTimeTexts.lastEnd.split(":").map(text => Number.parseInt(text));
        const firstShiftStartTime: ShiftTime = { hours: startHours, minutes: startMinutes };
        const lastShiftEndTime: ShiftTime = { hours: endHours, minutes: endMinutes };
        updateShiftListTimes(firstShiftStartTime, lastShiftEndTime);
    }

    const textInputProps: TextInputProps = {
        labelText: "",
        placeholder: defaultTimeText,
        editable: !done,
        maxLength: 5,
        selectTextOnFocus: true
    };
        
    return !done ? (
        <View style={style}>
            <View style={styles.shiftTimeInputs}>
                <TextInput
                    { ...textInputProps }
                    labelText="Alkaa"
                    defaultValue={shiftTimeTexts.firstStart}
                    style={{ ...styles.textInput, marginRight: 15 }}
                    onChangeText={(text) => setShiftTimeTexts({ ...shiftTimeTexts, firstStart: text })} />
                <TextInput
                    { ...textInputProps }
                    labelText="Päättyy"
                    defaultValue={shiftTimeTexts.lastEnd}
                    style={styles.textInput}
                    onChangeText={(text) => setShiftTimeTexts({ ...shiftTimeTexts, lastEnd: text })} />
            </View>
            <Button
                labelText="Valmis"
                onPress={() => setDone(true)}
                style={{ marginTop: 15 }} />
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    shiftTimeInputs: {
        flexDirection: "row"
    },
    textInput: {
        flex: 0.5
    }
});