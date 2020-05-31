import React, { useState } from "react";
import { View } from "react-native";
import ShiftTimeInputs from "./ShiftTimeInputs";
import { ShiftList, ShiftTime } from "../shift-generator";

interface ShiftListUpdateToolsProps {
    updateShiftListTimes: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => void;
    shiftList: ShiftList;
}

interface ShiftTimeTexts {
    firstStart: string;
    lastEnd: string;
    initialValuesUpdated: boolean;
}

export default function ShiftListUpdateTools(props: ShiftListUpdateToolsProps) {
    const defaultTimeText = "00:00";
    const { updateShiftListTimes, shiftList } = props;

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

    return (
        <View>
            <ShiftTimeInputs
                placeholder={defaultTimeText}
                firstShiftStartTimeText={shiftTimeTexts.firstStart}
                lastShiftEndTimeText={shiftTimeTexts.lastEnd}
                done={done}
                onFirstShiftStartTimeChangeText={(text) => setShiftTimeTexts({ ...shiftTimeTexts, firstStart: text })}
                onLastShiftEndTimeChangeText={(text) => setShiftTimeTexts({ ...shiftTimeTexts, lastEnd: text })}
                onButtonPress={() => setDone(true)} />
        </View>
    );
}