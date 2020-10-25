import generateShifts, { ShiftList } from "./shift-generator";

const _participantsNames = ["a", "b", "c", "d", "e"];

const _baseShiftList: ShiftList = {
    firstShiftStartTime: { hours: 21, minutes: 0 },
    lastShiftEndTime: { hours: 7, minutes: 0 },
    participants: _participantsNames.map((participantName) => ({
        name: participantName,
        shiftStartTime: { hours: 0, minutes: 0 },
        shiftEndTime: { hours: 0, minutes: 0 }
    }))
};

const baseShiftListString = JSON.stringify(_baseShiftList);

function generateShiftListHistory(listCount: number): ShiftList[] {
    let newShiftList: ShiftList = JSON.parse(baseShiftListString);
    const newShiftListHistory: ShiftList[] = [];

    for (let i = 0; i < listCount; i++) {
        if (i === 2) newShiftList.participants.splice(0, 1);
        if (i === 6) newShiftList.participants.push(
            { name: "f", shiftStartTime: { hours: 0, minutes: 0 }, shiftEndTime: { hours: 0, minutes: 0 } }
        );
        if (i === 11) newShiftList.participants[0].name = "g";
        newShiftList = generateShifts(newShiftList, newShiftListHistory);
        newShiftListHistory.push(JSON.parse(JSON.stringify(newShiftList)));
    }

    return newShiftListHistory;
}

describe("generated shiftlist is valid when it", () => {
    const shiftList: ShiftList = JSON.parse(baseShiftListString);
    const generatedShiftList = generateShifts(shiftList, []);

    test("includes all participants names", () => {
        const shiftListParticipantsNames = shiftList.participants.map(({ name }) => name);
        const generatedShiftListParticipantsNames = generatedShiftList.participants.map(({ name }) => name);
    
        expect(generatedShiftListParticipantsNames.sort()).toEqual(shiftListParticipantsNames.sort());
    });

    test("has valid timestamp", () => {
        const isValidTimestamp = !!Date.parse(generatedShiftList.timestamp || "");
        expect(isValidTimestamp).toEqual(true);
    });
});

test("shift participants not repeating", () => {
    // const shiftList: ShiftList = JSON.parse(baseShiftListString);
    const shiftListHistory = generateShiftListHistory(14);
    console.log(shiftListHistory.map(({ participants, shiftedNumber }) => [...participants.map(({ name }) => name), shiftedNumber]));

    const shiftListHistoryOnlyParticipantsNames = shiftListHistory.map(
        ({ participants }) => participants.map(({ name }) => name)
    );

    expect(new Set(shiftListHistoryOnlyParticipantsNames.map(
        (participantsNames) => JSON.stringify(participantsNames)
    )).size).toEqual(shiftListHistory.length);
});