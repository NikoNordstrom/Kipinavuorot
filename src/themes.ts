export interface Theme {
    dark: boolean;
    colors: {
        primary: string;
        background: string;
        card: string;
        fill: string;
        text: string;
        border: string;
    };
}

export const darkTheme: Theme = {
    dark: true,
    colors: {
        primary: "rgb(235, 194, 0)",
        background: "rgb(24, 24, 26)",
        card: "rgb(34, 34, 36)",
        fill: "rgb(28, 28, 30)",
        text: "rgb(186, 186, 186)",
        border: "rgb(22, 22, 24)"
    }
};