import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import TextInput from "./TextInput";
import Button from "./Button";
import { ShiftList, ShiftParticipant } from "../shift-generator";

interface AddShiftParticipantProps {
    shiftList: ShiftList;
    updateShiftListParticipants: (shiftParticipants: ShiftParticipant[]) => void;
    style?: ViewStyle;
}

export default function AddShiftParticipant(props: AddShiftParticipantProps) {
    const { shiftList, updateShiftListParticipants, style } = props;
    const [participantName, setParticipantName] = useState("");

    const addParticipant = () => {
        if (participantName.length <= 0) return;
        if (shiftList.participants.some(({ name }) => name === participantName)) return;

        updateShiftListParticipants([...shiftList.participants, {
            name: participantName,
            shiftStartTime: { hours: 0, minutes: 0 },
            shiftEndTime: { hours: 0, minutes: 0 }
        }]);
        
        setParticipantName("");
    };
    
    return (
        <View style={style}>
            <TextInput
                labelText="Osallistujan nimi"
                value={participantName}
                style={{ marginBottom: 15 }}
                onChangeText={(text) => setParticipantName(text)} />
            <Button
                labelText="Lisää osallistuja"
                onPress={addParticipant} />
        </View>
    );
}