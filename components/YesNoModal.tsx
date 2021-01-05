import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Modal from "./Modal";
import Button from "./Button";
import { darkTheme } from "../ts/themes";

interface Props {
    visible: boolean;
    title?: string;
    text?: string;
    onYes: () => void;
    onNo: () => void;
    onRequestClose: () => void;
}

export default function YesNoModal(props: Props) {
    const { visible, title, text, onYes, onNo, onRequestClose } = props;

    return (
        <Modal
            visible={visible}
            onRequestClose={onRequestClose}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalText}>{text}</Text>
            <View style={styles.modalButtonContainer}>
                <Button
                    style={{ flex: 1, marginRight: 15 }}
                    labelText="Kyllä"
                    onPress={onYes} />
                <Button
                    style={{ flex: 1 }}
                    labelText="Ei"
                    onPress={onNo} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalTitle: {
        marginBottom: 5,
        fontSize: 25,
        fontFamily: "Quicksand-Bold",
        includeFontPadding: false,
        color: darkTheme.colors.text
    },
    modalText: {
        fontSize: 20,
        fontFamily: "Quicksand-Medium",
        includeFontPadding: false,
        color: darkTheme.colors.text
    },
    modalButtonContainer: {
        marginTop: 15,
        flexDirection: "row"
    }
});