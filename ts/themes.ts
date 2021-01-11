export interface Theme {
    dark: boolean;
    colors: {
        primary: string;
        background: string;
        card: string;
        fill: string;
        fillLight: string;
        text: string;
        border: string;
    };
}

export const darkTheme: Theme = {
    dark: true,
    colors: {
        primary: "rgb(255, 195, 0)",
        background: "rgb(28, 28, 30)",
        card: "rgb(38, 38, 40)",
        fill: "rgb(32, 32, 34)",
        fillLight: "rgb(43, 43, 46)",
        text: "rgb(175, 175, 175)",
        border: "rgb(26, 26, 28)"
    }
};