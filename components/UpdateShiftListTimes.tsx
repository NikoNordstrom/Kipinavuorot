import React, { useEffect, useRef, useState } from "react";
import { View, ViewStyle, StyleSheet, TextInput as ReactNativeTextInput } from "react-native";

import TextInput, { TextInputProps } from "./TextInput";
import Button from "./Button";
import { ShiftList, ShiftTime } from "../ts/shift-generator";
import { ShiftTimeTexts } from "../App";
import { isValidShiftTime, toShiftTime } from "../ts/tools";

interface UpdateShiftListTimesProps {
    shiftList: ShiftList;
    firstStartDefaultText?: string;
    lastEndDefaultText?: string;
    updateShiftListTimes: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => void;
    shiftListTimesToString: (firstShiftStartTime: ShiftTime, lastShiftEndTime: ShiftTime) => ShiftTimeTexts;
    style?: ViewStyle;
}

type ShiftTimeTextInputName = "firstStart" | "lastEnd";

export default function UpdateShiftListTimes(props: UpdateShiftListTimesProps) {
    const {
        shiftList,
        firstStartDefaultText,
        lastEndDefaultText,
        updateShiftListTimes,
        shiftListTimesToString,
        style
    } = props;

    const defaultTimeText = "00:00";

    const shiftListTimeTexts = shiftListTimesToString(shiftList.firstShiftStartTime, shiftList.lastShiftEndTime);

    const shiftTimesAlreadySet = (
        shiftListTimeTexts.firstStart !== defaultTimeText &&
        shiftListTimeTexts.lastEnd !== defaultTimeText
    );

    const [shiftTimeTexts, setShiftTimeTexts] = useState({
        firstStart: firstStartDefaultText || shiftListTimeTexts.firstStart,
        lastEnd: lastEndDefaultText || shiftListTimeTexts.lastEnd
    });
    const [done, setDone] = useState(shiftTimesAlreadySet);

    const textInputRefs = {
        firstStart: useRef<ReactNativeTextInput>(null),
        lastEnd: useRef<ReactNativeTextInput>(null)
    };

    const handleShiftTimeTexts = (shiftTime: ShiftTimeTextInputName, currentText: string) => {
        const previousText = shiftTimeTexts[shiftTime];
        const isInsert = currentText.length >= previousText.length;

        if (currentText.length === 2 && isInsert) {
            if (currentText.endsWith(":")) shiftTimeTexts[shiftTime] = `0${currentText}`;
            else shiftTimeTexts[shiftTime] = `${currentText}:`;
        }
        else shiftTimeTexts[shiftTime] = currentText;

        setShiftTimeTexts({ ...shiftTimeTexts });
    };

    useEffect(() => {
        if (!done) return;

        updateShiftListTimes(
            toShiftTime(shiftTimeTexts.firstStart),
            toShiftTime(shiftTimeTexts.lastEnd)
        );
    }, [done]);

    const { firstStart, lastEnd } = shiftTimeTexts;

    const firstStartFocus = firstStart === lastEnd || firstStart.length < 5;
    const lastEndFocus = !firstStartFocus;

    if (firstStartFocus) textInputRefs.firstStart.current?.focus();
    if (lastEndFocus) textInputRefs.lastEnd.current?.focus();

    const validShiftTimeTexts = (() => {
        if (firstStart === lastEnd) return false;
        if (firstStart.length !== 5 || lastEnd.length !== 5) return false;

        if (!isValidShiftTime(toShiftTime(firstStart))) return false;
        if (!isValidShiftTime(toShiftTime(lastEnd))) return false;

        return true;
    })();

    const textInputProps: Partial<TextInputProps> = {
        textStyle: {
            fontFamily: "Nunito-Regular",
            includeFontPadding: true
        },
        placeholder: defaultTimeText,
        editable: !done,
        maxLength: 5,
        selectTextOnFocus: true,
        keyboardType: "number-pad"
    };
        
    return !done ? (
        <View style={style}>
            <View style={styles.shiftTimeInputs}>
                <TextInput
                    { ...textInputProps }
                    labelText="Alkaa"
                    value={shiftTimeTexts.firstStart}
                    ref={textInputRefs.firstStart}
                    style={{ ...styles.textInput, marginRight: 15 }}
                    onChangeText={currentText => handleShiftTimeTexts("firstStart", currentText)} />
                <TextInput
                    { ...textInputProps }
                    labelText="Päättyy"
                    value={shiftTimeTexts.lastEnd}
                    ref={textInputRefs.lastEnd}
                    style={styles.textInput}
                    onChangeText={currentText => handleShiftTimeTexts("lastEnd", currentText)} />
            </View>
            <Button
                labelText="Valmis"
                disabled={!validShiftTimeTexts}
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