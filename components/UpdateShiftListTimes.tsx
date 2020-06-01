import React, { useState } from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import TextInput, { TextInputProps } from "./TextInput";
import Button from "./Button";
import { ShiftList, ShiftTime } from "../shift-generator";

interface UpdateShiftListTimesProps {
    shiftList: ShiftList;
    updateShiftListTimes: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => void;
    style?: ViewStyle;
}

interface ShiftTimeTexts {
    firstStart: string;
    lastEnd: string;
    initialValuesUpdated: boolean;
}

export default function UpdateShiftListTimes(props: UpdateShiftListTimesProps) {
    const { shiftList, updateShiftListTimes, style } = props;
    const defaultTimeText = "00:00";

    const { hours: startHours, minutes: startMinutes } = shiftList.firstShiftStartTime;
    const firstShiftStartTimeTextCurrentValue = `${startHours < 10 ? "0": ""}${startHours}:${startMinutes < 10 ? "0" : ""}${startMinutes}`;
    const { hours: endHours, minutes: endMinutes } = shiftList.lastShiftEndTime;
    const lastShiftEndTimeTextCurrentValue = `${endHours < 10 ? "0": ""}${endHours}:${endMinutes < 10 ? "0" : ""}${endMinutes}`;
    
    const [shiftTimeTexts, setShiftTimeTexts] = useState<ShiftTimeTexts>({
        firstStart: firstShiftStartTimeTextCurrentValue,
        lastEnd: lastShiftEndTimeTextCurrentValue,
        initialValuesUpdated: false
    });
    const [done, setDone] = useState(false);

    const shiftTimesAlreadySet = (
        firstShiftStartTimeTextCurrentValue !== defaultTimeText &&
        lastShiftEndTimeTextCurrentValue !== defaultTimeText
    );

    if (shiftTimesAlreadySet && !shiftTimeTexts.initialValuesUpdated) {
        setShiftTimeTexts({
            firstStart: firstShiftStartTimeTextCurrentValue,
            lastEnd: lastShiftEndTimeTextCurrentValue,
            initialValuesUpdated: true
        });
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
        maxLength: 5
    };
        
    return (
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
            {
                !done
                    ? <Button
                        labelText="Valmis"
                        onPress={() => setDone(true)}
                        style={{ marginTop: 15 }} />
                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    shiftTimeInputs: {
        flexDirection: "row"
    },
    textInput: {
        flex: 0.5
    }
});