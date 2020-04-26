import React from "react";
import { View, StyleSheet } from "react-native";
import TextInput from "./TextInput";
import Button from "./Button";

interface ShiftTimeInputsProps {
    placeholder: string;
    firstShiftStartTimeText: string;
    lastShiftEndTimeText: string;
    done: boolean;
    onButtonPress: () => void;
    onFirstShiftStartTimeChangeText: (text: string) => void;
    onLastShiftEndTimeChangeText: (text: string) => void;
}

export default function ShiftTimeInputs(props: ShiftTimeInputsProps) {
    const {
        placeholder,
        firstShiftStartTimeText,
        lastShiftEndTimeText,
        done,
        onButtonPress,
        onFirstShiftStartTimeChangeText,
        onLastShiftEndTimeChangeText
    } = props;
    return (
        <View>
            <View style={styles.shiftTimeInputs}>
                <TextInput
                    labelText="Alkaa"
                    placeholder={placeholder}
                    defaultValue={firstShiftStartTimeText}
                    style={{ marginRight: 15 }}
                    editable={!done}
                    onChangeText={onFirstShiftStartTimeChangeText} />
                <TextInput
                    labelText="Päättyy"
                    placeholder={placeholder}
                    defaultValue={lastShiftEndTimeText}
                    editable={!done}
                    onChangeText={onLastShiftEndTimeChangeText} />
            </View>
            {
                !done
                    ? <Button labelText="Valmis" onPress={onButtonPress} />
                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    shiftTimeInputs: {
        flexDirection: "row",
        marginBottom: 15
    }
});