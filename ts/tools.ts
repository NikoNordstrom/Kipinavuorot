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

export function toShiftTime(shiftTimeString: string): ShiftTime {
    const parsedShiftTimeArray = shiftTimeString.split(":").map(numberString => Number.parseInt(numberString));

    return { hours: parsedShiftTimeArray[0], minutes: parsedShiftTimeArray[1] };
}

export function isValidShiftTime(shiftTime: ShiftTime) {
    const { hours, minutes } = shiftTime;

    if (isNaN(hours) || isNaN(minutes)) return false;
    if (hours > 23 || hours < 0) return false;
    if (minutes > 59 || minutes < 0) return false;

    return true;
}

export function addOpacity(rgbString: string, opacity: number) {
    return `${rgbString.replace("rgb", "rgba").split(")")[0]}, ${opacity})`;
}