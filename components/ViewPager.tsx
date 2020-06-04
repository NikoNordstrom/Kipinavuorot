import React, { ReactChildren, useState, useEffect } from "react";
import { View, ViewStyle, Text, StyleSheet } from "react-native";
import BaseViewPager, {
    ViewPagerOnPageSelectedEventData,
    ViewPagerOnPageScrollEventData
} from "@react-native-community/viewpager";

interface ViewPagerProps {
    children: ReactChildren;
    headerInfo: string;
    firstPageHeaderInfo: () => string;
    updateHeaderInfo: (text: string) => void;
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
    const { children, headerInfo, firstPageHeaderInfo, updateHeaderInfo, style } = props;

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
        setState({
            ...state,
            progress: {
                position: e.position,
                offset: e.offset
            }
        });
    };

    const goToPage = (page: number) => {
        viewPager.current?.setPage(page);
    };

    const underlineOffset = state.progress.offset === 0 ? state.page : state.progress.offset;

    useEffect(() => {
        const newHeaderInfo = state.page === 0 ? firstPageHeaderInfo() : "";
        if (newHeaderInfo === headerInfo) return;
        if (newHeaderInfo !== "00:00 - 00:00") updateHeaderInfo(newHeaderInfo);
    });

    return (
        <View style={style}>
            <View style={styles.tabsHeaderContainer}>
                <Text
                    style={[styles.tabHeader, state.page === 0 ? { fontFamily: "Quicksand-Bold" } : null]}
                    onPress={() => goToPage(0)}>Nykyinen</Text>
                <Text
                    style={[styles.tabHeader, state.page === 1 ? { fontFamily: "Quicksand-Bold" } : null]}
                    onPress={() => goToPage(1)}>Aiemmat</Text>
            </View>
            <View style={[styles.tabsUnderline, { left: `${underlineOffset * 50}%` }]} />
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
    tabsHeaderContainer: {
        flexDirection: "row"
    },
    tabHeader: {
        paddingTop: 15,
        paddingBottom: 15,
        flex: 0.5,
        textAlign: "center",
        fontSize: 15,
        fontFamily: "Quicksand-Medium"
    },
    tabsUnderline: {
        height: 2,
        width: "50%",
        backgroundColor: "mediumseagreen"
    },
    viewPager: {
        marginTop: 15,
        flex: 1
    }
});