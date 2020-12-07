import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

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
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
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
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(28, 28, 31, 0.6)"
    },
    modalView: {
        margin: 30,
        padding: 20,
        borderRadius: 10,
        backgroundColor: darkTheme.colors.card,
        elevation: 5
    },
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