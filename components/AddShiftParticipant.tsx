import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import TextInput from "./TextInput";
import Button from "./Button";
import { ShiftList, ShiftParticipant } from "../shift-generator";

interface AddShiftParticipantProps {
    shiftList: ShiftList;
    updateShiftListParticipants: (shiftParticipants: ShiftParticipant[]) => void;
    setShiftListReady: () => void;
    style?: ViewStyle;
}

export default function AddShiftParticipant(props: AddShiftParticipantProps) {
    const { shiftList, updateShiftListParticipants, setShiftListReady, style } = props;
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

    const doneButtonDisabled = shiftList.participants.length <= 1;
    
    return (
        <View style={style}>
            <TextInput
                labelText="Kipinävuoroihin osallistuvan nimi"
                value={participantName}
                onChangeText={(text) => setParticipantName(text)}
                style={{ marginBottom: 15 }} />
            <View style={{ flexDirection: "row" }}>
                <Button 
                    labelText="Valmis"
                    disabled={doneButtonDisabled}
                    onPress={() => setShiftListReady()}
                    style={{
                        flex: 0.5,
                        marginRight: 15
                    }} />
                <Button
                    labelText="Lisää"
                    onPress={addParticipant}
                    style={{ flex: 0.5 }} />
            </View>
        </View>
    );
}