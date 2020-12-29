import React, { ReactNode, useState, useEffect } from "react";
import { View, ViewStyle, Text, StyleSheet } from "react-native";
import BaseViewPager, {
    ViewPagerOnPageSelectedEventData,
    ViewPagerOnPageScrollEventData
} from "@react-native-community/viewpager";

import { darkTheme } from "../ts/themes";

interface ViewPagerProps {
    children: ReactNode;
    headerInfoRef: React.RefObject<Text>;
    headerInfoFullHeight: number;
    style?: ViewStyle;
}

interface State {
    page: number;
    progress: {
        position: number;
        offset: number;
    };
}

export default function ViewPager(props: ViewPagerProps) {
    const { children, headerInfoRef, headerInfoFullHeight, style } = props;

    const [state, setState] = useState<State>({
        page: 0,
        progress: {
            position: 0,
            offset: 0
        }
    });

    const viewPager: React.Ref<BaseViewPager> = React.createRef();

    const onPageSelected = (e: ViewPagerOnPageSelectedEventData) => {
        if (state.page === e.position) return;
        setState({
            ...state,
            page: e.position
        });
    };

    const onPageScroll = (e: ViewPagerOnPageScrollEventData) => {
        const offset = e.offset === 0 ? e.position : e.offset;
        setState({
            ...state,
            page: offset < 0.5 ? 0 : 1,
            progress: {
                position: e.position,
                offset
            }
        });
    };

    const goToPage = (page: number) => {
        viewPager.current?.setPage(page);
    };

    useEffect(() => {
        if (headerInfoFullHeight === 0) return;
        headerInfoRef.current?.setNativeProps({
            style: {
                height: (1 - state.progress.offset) * headerInfoFullHeight,
                opacity: 1 - state.progress.offset
            }
        });
    });

    return (
        <View style={style}>
            <View style={styles.headerContainer}>
                <View style={styles.tabsHeaderContainer}>
                    <Text
                        style={[styles.tabHeader, state.progress.offset < 0.5 ? { fontFamily: "Quicksand-Bold" } : null]}
                        onPress={() => goToPage(0)}>Nykyinen</Text>
                    <Text
                        style={[styles.tabHeader, state.progress.offset >= 0.5 ? { fontFamily: "Quicksand-Bold" } : null]}
                        onPress={() => goToPage(1)}>Aiemmat</Text>
                </View>
                <View style={[styles.tabsUnderline, { left: `${state.progress.offset * 50}%` }]} />
            </View>
            <BaseViewPager
                style={styles.viewPager}
                ref={viewPager}
                onPageSelected={({ nativeEvent }) => onPageSelected(nativeEvent)}
                onPageScroll={({ nativeEvent }) => onPageScroll(nativeEvent)}>
                {children}
            </BaseViewPager>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 15
    },
    tabsHeaderContainer: {
        flexDirection: "row"
    },
    tabHeader: {
        paddingTop: 12.5,
        paddingBottom: 12.5,
        flex: 0.5,
        textAlign: "center",
        fontSize: 17.5,
        fontFamily: "Quicksand-Medium",
        color: darkTheme.colors.text
    },
    tabsUnderline: {
        height: 2,
        width: "50%",
        backgroundColor: darkTheme.colors.primary
    },
    viewPager: {
        marginTop: 15,
        flex: 1
    }
});