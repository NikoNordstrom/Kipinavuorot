import generateShifts, { ShiftList, ShiftTime } from "../ts/shift-generator";

const _participantsNames = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];

const _baseShiftList: ShiftList = {
    firstShiftStartTime: { hours: 22, minutes: 0 },
    lastShiftEndTime: { hours: 6, minutes: 30 },
    participants: _participantsNames.map((participantName) => ({
        name: participantName,
        shiftStartTime: { hours: 0, minutes: 0 },
        shiftEndTime: { hours: 0, minutes: 0 }
    })),
    shiftedNumber: 0
};

const baseShiftListString = JSON.stringify(_baseShiftList);

function generateShiftListHistory(listCount: number): ShiftList[] {
    let newShiftList: ShiftList = JSON.parse(baseShiftListString);
    const newShiftListHistory: ShiftList[] = [];

    for (let i = 0; i < listCount; i++) {
        newShiftList = generateShifts(newShiftList, newShiftListHistory);
        newShiftListHistory.push(JSON.parse(JSON.stringify(newShiftList)));
    }

    return newShiftListHistory;
}

describe("generated shiftlist is valid when", () => {
    const shiftList: ShiftList = JSON.parse(baseShiftListString);
    const generatedShiftList = generateShifts(shiftList, []);
    
    const allShiftsDurationInMinutes = generatedShiftList.participants.map(({ shiftStartTime, shiftEndTime }) => {
        const shiftStartTimeDate = new Date();
        const shiftEndTimeDate = new Date();

        shiftStartTimeDate.setHours(shiftStartTime.hours, shiftStartTime.minutes, 0, 0);
        shiftEndTimeDate.setHours(shiftEndTime.hours, shiftEndTime.minutes, 0, 0);

        // If shiftEndTimeDate will be on the next day then set the correct date for that.
        if (shiftEndTimeDate.getHours() < shiftStartTimeDate.getHours()) {
            shiftEndTimeDate.setDate(shiftEndTimeDate.getDate() + 1);
        }
        
        return (shiftEndTimeDate.getTime() - shiftStartTimeDate.getTime()) / 1000 / 60;
    });

    test("it includes all participants names", () => {
        const shiftListParticipantsNames = shiftList.participants.map(({ name }) => name);
        const generatedShiftListParticipantsNames = generatedShiftList.participants.map(({ name }) => name);

        expect(generatedShiftListParticipantsNames.sort()).toEqual(shiftListParticipantsNames.sort());
    });

    test("its participants shift times are correct", () => {
        const shiftTimesMatch = (shiftTimeA: ShiftTime, shiftTimeB: ShiftTime): boolean => {
            if (shiftTimeA.hours !== shiftTimeB.hours) return false;
            if (shiftTimeA.minutes !== shiftTimeB.minutes) return false;
            return true;
        };
        
        const allShiftTimesAreCorrect = generatedShiftList.participants.every(({ shiftStartTime, shiftEndTime }, participantIndex) => {
            let shiftTimesAreCorrect = false;
            
            if (participantIndex === 0) shiftTimesAreCorrect = shiftTimesMatch(shiftStartTime, generatedShiftList.firstShiftStartTime);
            
            if (participantIndex === generatedShiftList.participants.length - 1) {
                shiftTimesAreCorrect = shiftTimesMatch(shiftEndTime, generatedShiftList.lastShiftEndTime);
            }
            
            if (participantIndex > 0) {
                shiftTimesAreCorrect = shiftTimesMatch(shiftStartTime, generatedShiftList.participants[participantIndex - 1].shiftEndTime);
            }
            
            return shiftTimesAreCorrect;
        });
        
        expect(allShiftTimesAreCorrect).toEqual(true);
    });

    test("participants shift durations are correct length", () => {
        const allShiftDurationsAreCorrectLength = allShiftsDurationInMinutes
            .every(durationInMinutes => allShiftsDurationInMinutes.every(anotherDurationInMinutes => {
                return [0, 5].includes(Math.abs(durationInMinutes - anotherDurationInMinutes));
            }));

        expect(allShiftDurationsAreCorrectLength).toBeTruthy();
    });

    test("participants shift duration is divisible by 5", () => {
        const allShiftDurationsAreDivisibleBy5 = allShiftsDurationInMinutes
            .every(durationInMinutes => durationInMinutes % 5 === 0);

        expect(allShiftDurationsAreDivisibleBy5).toBeTruthy();
    });

    test("it has valid timestamp", () => expect(Date.parse(generatedShiftList.timestamp || "")).toBeTruthy());
});

test("shift participants not repeating", () => {
    const shiftListHistory = generateShiftListHistory(_participantsNames.length);

    const shiftListHistoryOnlyParticipantsNames = shiftListHistory.map(
        ({ participants }) => participants.map(({ name }) => name)
    );

    expect(new Set(shiftListHistoryOnlyParticipantsNames.map(
        (participantsNames) => JSON.stringify(participantsNames)
    )).size).toEqual(shiftListHistory.length);
});

test("shift generator can handle participant name and length changes", () => {
    let shiftList: ShiftList = JSON.parse(baseShiftListString);
    const shiftListHistory: ShiftList[] = [];

    for (let i = 1; i <= 15; i++) {
        if (i === 4) shiftList.participants.splice(0, 2);
        if (i === 7) shiftList.participants.push({
            name: "z",
            shiftStartTime: { hours: 0, minutes: 0 },
            shiftEndTime: { hours: 0, minutes: 0 }
        });
        if (i === 8) shiftList.participants.splice(0, 1);
        
        shiftList = generateShifts(shiftList, shiftListHistory);
        shiftListHistory.push(JSON.parse(JSON.stringify(shiftList)));

        if (i === 12) shiftList.participants[0].name = "y";
    }

    const shiftListHistoryParticipantsNames = shiftListHistory.map(({ participants }) => participants.map(({ name }) => name));

    let canHandle = true;

    // If some shiftlist has changed in the shiftListHistory then check if its shiftedNumber property is 0
    // if not then the shift generator has failed to handle participant name or length changes.
    for (let i = 1; i < shiftListHistoryParticipantsNames.length; i++) {
        const shiftListHasChanged = (
            shiftListHistoryParticipantsNames[i].length !== shiftListHistoryParticipantsNames[i - 1].length ||
            JSON.stringify(shiftListHistoryParticipantsNames[i].sort()) !== JSON.stringify(shiftListHistoryParticipantsNames[i - 1].sort())
        );

        if (shiftListHasChanged) {
            canHandle = shiftListHistory[i].shiftedNumber === 0;
        }
    }

    expect(canHandle).toEqual(true);
});