import React, { useState } from "react";
import { View } from "react-native";
import ShiftTimeInputs from "./ShiftTimeInputs";
import { ShiftTime } from "../shift-generator";

interface ShiftListUpdateToolsProps {
    updateShiftListTimes: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => void;
    defaultStartTimeText: string;
    defaultEndTimeText: string;
}

export default function ShiftListUpdateTools(props: ShiftListUpdateToolsProps) {
    const { updateShiftListTimes, defaultStartTimeText, defaultEndTimeText } = props;
    const defaultTextValue = "00:00";
    const [firstShiftStartTimeText, setFirstShifStartTimeText] = useState(defaultStartTimeText);
    const [lastShiftEndTimeText, setLastShiftEndTimeText] = useState(defaultEndTimeText);
    const [done, setDone] = useState(false);
    if (done) {
        const [startHours, startMinutes] = firstShiftStartTimeText.split(":").map(text => Number.parseInt(text));
        const [endHours, endMinutes] = lastShiftEndTimeText.split(":").map(text => Number.parseInt(text));
        const firstShiftStartTime: ShiftTime = { hours: startHours, minutes: startMinutes };
        const lastShiftEndTime: ShiftTime = { hours: endHours, minutes: endMinutes };
        updateShiftListTimes(firstShiftStartTime, lastShiftEndTime);
    }
    return (
        <View>
            <ShiftTimeInputs
                placeholder={defaultTextValue}
                firstShiftStartTimeText={firstShiftStartTimeText}
                lastShiftEndTimeText={lastShiftEndTimeText}
                done={done}
                onFirstShiftStartTimeChangeText={(text) => setFirstShifStartTimeText(text)}
                onLastShiftEndTimeChangeText={(text) => setLastShiftEndTimeText(text)}
                onButtonPress={() => setDone(true)} />
        </View>
    );
}