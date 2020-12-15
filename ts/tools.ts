import { ShiftTime } from "./shift-generator";

type Milliseconds = number;
type ISOString = string;

export function dateFormat(dateValue: Milliseconds | ISOString) {
    const date = new Date(dateValue);

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

export function timeFormat(shiftTime: ShiftTime) {
    const { hours, minutes } = shiftTime;

    const zeroPrefix = (value: number) => `${value < 10 ? "0" : ""}${value}`;

    if (hours === -1 && minutes === -1) return "-";

    return `${zeroPrefix(hours)}:${zeroPrefix(minutes)}`;
}

export function addOpacity(rgbString: string, opacity: number) {
    return `${rgbString.replace("rgb", "rgba").split(")")[0]}, ${opacity})`;
}