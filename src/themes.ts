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
        primary: "rgb(255, 195, 0)",
        background: "rgb(28, 28, 31)",
        card: "rgb(36, 36, 38)",
        fill: "rgb(30, 30, 32)",
        text: "rgb(186, 186, 186)",
        border: "rgb(24, 24, 27)"
    }
};