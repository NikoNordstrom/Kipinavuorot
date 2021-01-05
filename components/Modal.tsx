import React from "react";
import { Modal as ReactNativeModal, View, StyleSheet, ViewStyle } from "react-native";

import { darkTheme } from "../ts/themes";

interface ModalProps {
    visible: boolean;
    children: React.ReactNode;
    style?: ViewStyle;
    onRequestClose: () => void;
}

export default function Modal(props: ModalProps) {
    const { visible, children, style, onRequestClose } = props;

    return (
        <ReactNativeModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}>
            <View style={styles.centeredView}>
                <View style={[styles.modalView, style]}>{children}</View>
            </View>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    modalView: {
        margin: 30,
        padding: 20,
        borderRadius: 10,
        backgroundColor: darkTheme.colors.card,
        elevation: 5
    }
});