import React from "react";
import { View, StyleSheet } from "react-native";

import Modal from "./Modal";
import FlatShiftList from "./FlatShiftList";
import { ShiftList } from "ts/shift-generator";
import { darkTheme } from "../ts/themes";

interface ShiftListModalProps {
    shiftList: ShiftList;
    visible: boolean;
    onRequestClose: () => void;
}

export default function ShiftListModal(props: ShiftListModalProps) {
    const { shiftList, visible, onRequestClose } = props;

    return (
        <Modal
            visible={visible}
            style={styles.modal}
            onRequestClose={onRequestClose}>
            <View>
                <FlatShiftList {...shiftList} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "stretch"
    }
});