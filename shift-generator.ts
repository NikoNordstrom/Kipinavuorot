export interface ShiftTime {
    hours: number;
    minutes: number;
}

export interface ShiftParticipant {
    name: string;
    shiftStartTime: ShiftTime;
    shiftEndTime: ShiftTime;
    goodShiftRatioBonus?: true;
}

export interface ShiftList {
    firstShiftStartTime: ShiftTime;
    lastShiftEndTime: ShiftTime;
    participants: ShiftParticipant[];
    shiftsGeneratedTimestamp?: string;
}

interface ShiftCandidate {
    name: string;
    shiftChancePercent: number;
}

function generateEmptyShifts(shiftList: ShiftList): ShiftParticipant[] {
    if (shiftList.participants.length < 1) return [];

    const firstShiftStartTime = new Date();
    const lastShiftEndTime = new Date();
    firstShiftStartTime.setHours(shiftList.firstShiftStartTime.hours, shiftList.firstShiftStartTime.minutes, 0, 0);
    lastShiftEndTime.setHours(shiftList.lastShiftEndTime.hours, shiftList.lastShiftEndTime.minutes, 0, 0);

    // If lastShiftEndTime will be on the next day then set the correct date for that.
    if (lastShiftEndTime.getHours() < firstShiftStartTime.getHours()) {
        lastShiftEndTime.setDate(lastShiftEndTime.getDate() + 1);
    }

    const fullShiftLengthHours = Math.abs(firstShiftStartTime.getTime() - lastShiftEndTime.getTime()) / 1000 / 60 / 60;
    const shiftDurationMinutes = fullShiftLengthHours / shiftList.participants.length * 60;

    // Create ShiftParticipant array that includes all shift start and end times, but leave participant names empty.
    return new Array(shiftList.participants.length).fill(null).map((value, index) => {
        const lastShiftEndTimeMinutes = (firstShiftStartTime.getHours() * 60 + firstShiftStartTime.getMinutes()) + shiftDurationMinutes * index;
        return {
            name: "",
            shiftStartTime: {
                hours: Math.floor(lastShiftEndTimeMinutes / 60) % 24,
                minutes: Math.floor(lastShiftEndTimeMinutes % 60)
            },
            shiftEndTime: {
                hours: Math.floor((lastShiftEndTimeMinutes + shiftDurationMinutes) / 60) % 24,
                minutes: Math.floor((lastShiftEndTimeMinutes + shiftDurationMinutes) % 60)
            }
        };
    });
}

function generateRandomShifts(shiftList: ShiftList): ShiftParticipant[] {
    const participantsNames = shiftList.participants.map(({ name }) => name);
    let emptyShiftList = generateEmptyShifts(shiftList);
    emptyShiftList = roundShiftMinutesToFive(emptyShiftList);
    // Add all of the participants names to randomly selected participants with shifts.
    return emptyShiftList.map(shiftParticipant => {
        const participantNameIndex = Math.floor(Math.random() * participantsNames.length);
        shiftParticipant.name = participantsNames[participantNameIndex];
        participantsNames.splice(participantNameIndex, 1);
        return shiftParticipant;
    });
}

function whoGetsGoodShifts(shiftList: ShiftList, shiftListHistory: ShiftList[]): string[] {
    const possibleCandidates: ShiftCandidate[] = [];

    // Calculate shiftChancePercent for every participant and populate possibleCandidates.
    shiftList.participants.forEach(participant => {
        let totalNumberOfPreviousShifts = 0;
        let previousGoodShiftsCount = 0;
        shiftListHistory.forEach(({ participants }) => {
            totalNumberOfPreviousShifts += participants.filter(({ name }) => name === participant.name).length;
            if (participants[0].name === participant.name) previousGoodShiftsCount++;
            else if (participants[participants.length - 1].name === participant.name) previousGoodShiftsCount++;
        });
        if (participant.goodShiftRatioBonus) {
            previousGoodShiftsCount--;
            delete participant.goodShiftRatioBonus;
        }
        previousGoodShiftsCount += shiftListHistory.length - totalNumberOfPreviousShifts;
        possibleCandidates.push({
            name: participant.name,
            shiftChancePercent: (previousGoodShiftsCount + 1) / (totalNumberOfPreviousShifts + 1)
        });
    });

    // Sort possibleCandidates in ascending order.
    possibleCandidates.sort(({ shiftChancePercent: a }, { shiftChancePercent: b }) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    // Remove unnecessary candidates from possibleCandidates.
    possibleCandidates.forEach(({ shiftChancePercent }, candidateIndex) => {
        if (shiftChancePercent > possibleCandidates[1].shiftChancePercent) {
            possibleCandidates.splice(candidateIndex);
        }
    });

    // Select good shift candidates and return their names in an array.
    if (possibleCandidates.length > 2) {
        const firstAndLastShiftParticipantsNames: string[] = [];
        if (possibleCandidates[0].shiftChancePercent < possibleCandidates[1].shiftChancePercent) {
            firstAndLastShiftParticipantsNames.push(possibleCandidates[0].name);
            possibleCandidates.shift();
            const selectedCandidateName = possibleCandidates[Math.floor(Math.random() * possibleCandidates.length)].name;
            firstAndLastShiftParticipantsNames.push(selectedCandidateName);
        }
        else {
            const firstSelectedCandidateIndex = Math.floor(Math.random() * possibleCandidates.length);
            firstAndLastShiftParticipantsNames.push(possibleCandidates[firstSelectedCandidateIndex].name);
            possibleCandidates.splice(firstSelectedCandidateIndex, 1);
            const secondSelectedCandidateIndex = Math.floor(Math.random() * possibleCandidates.length);
            firstAndLastShiftParticipantsNames.push(possibleCandidates[secondSelectedCandidateIndex].name);
        }
        return firstAndLastShiftParticipantsNames;
    }
    const firstShiftParticipantIndex = Math.floor(Math.random() * 2);
    return [
        possibleCandidates[firstShiftParticipantIndex].name,
        possibleCandidates[Math.abs(firstShiftParticipantIndex - 1)].name
    ];
}

function whoGetsThisShift(theShiftStartTime: ShiftTime, participantNames: string[], shiftListHistory: ShiftList[]): string {
    const possibleCandidates: ShiftCandidate[] = [];

    participantNames.forEach(participantName => {
        let totalNumberOfPreviousShifts = 0;
        let totalNumberOfTheShiftOccurrences = 0;

        shiftListHistory.forEach(({ participants }) => {
            participants.forEach(({ name, shiftStartTime }) => {
                if (name !== participantName) return;
                totalNumberOfPreviousShifts++;
                const { hours, minutes } = shiftStartTime;
                if (hours === theShiftStartTime.hours && minutes === theShiftStartTime.minutes) totalNumberOfTheShiftOccurrences++;
            });
        });

        possibleCandidates.push({
            name: participantName,
            shiftChancePercent: (totalNumberOfTheShiftOccurrences + 1) / (totalNumberOfPreviousShifts + 1)
        });
    });

    possibleCandidates.sort(({ shiftChancePercent: a }, { shiftChancePercent: b }) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    possibleCandidates.forEach(({ shiftChancePercent }, index) => {
        if (shiftChancePercent > possibleCandidates[0].shiftChancePercent) possibleCandidates.splice(index);
    });

    if (possibleCandidates.length === 1) return possibleCandidates[0].name;
    return possibleCandidates[Math.floor(Math.random() * possibleCandidates.length)].name;
}

function roundShiftMinutesToFive(shiftParticipants: ShiftParticipant[]): ShiftParticipant[] {
    let allExtraMinutes = 0;

    shiftParticipants.forEach((participant) => {
        allExtraMinutes += participant.shiftEndTime.minutes % 5;
    });

    for (let i = 0; i < 2; i++) {
        if (allExtraMinutes / 5 >= 1) {
            shiftParticipants[0].shiftEndTime.minutes -= shiftParticipants[0].shiftEndTime.minutes % 5;
            shiftParticipants[0].shiftEndTime.minutes += 5;
            if (shiftParticipants[0].shiftEndTime.minutes === 60) {
                shiftParticipants[0].shiftEndTime.hours++;
                shiftParticipants[0].shiftEndTime.minutes = 0;
            }
            allExtraMinutes -= 5;
        }
    }

    shiftParticipants.forEach((participant, index) => {
        if (index > 0) {
            const shiftStartTime = { ...shiftParticipants[index - 1].shiftEndTime };
            shiftParticipants[index].shiftStartTime = shiftStartTime;
        }
        if (index === shiftParticipants.length - 1) return;
        const shiftEndTimeExtraMinutes = participant.shiftEndTime.minutes % 5;
        shiftParticipants[index].shiftEndTime.minutes -= shiftEndTimeExtraMinutes;
    });
    return shiftParticipants;
}

export default function generateShifts(shiftList: ShiftList, shiftListHistory?: ShiftList[], randomShifts?: boolean): ShiftList {
    // This makes a new copy of shiftList so that changes won't affect the original object.
    const newShiftList: ShiftList = {
        ...shiftList,
        participants: generateEmptyShifts(shiftList),
        shiftsGeneratedTimestamp: (Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toString()
    };

    if (randomShifts || !shiftListHistory || shiftListHistory.length < 1) {
        newShiftList.participants = generateRandomShifts(shiftList);
        return newShiftList;
    }

    const goodShiftParticipantsNames = whoGetsGoodShifts(shiftList, shiftListHistory);
    newShiftList.participants[0].name = goodShiftParticipantsNames[0];
    newShiftList.participants[newShiftList.participants.length - 1].name = goodShiftParticipantsNames[1];

    const remainingShifts = newShiftList.participants.filter(({ name }) => {
        if (goodShiftParticipantsNames.includes(name)) return false;
        return true;
    });

    const remainingParticipantNames = shiftList.participants
        .filter(({ name }) => !goodShiftParticipantsNames.includes(name))
        .map(({ name }) => name);

    remainingShifts.forEach(({ shiftStartTime }) => {
        const thisShiftParticipantName = whoGetsThisShift(shiftStartTime, remainingParticipantNames, shiftListHistory);
        remainingParticipantNames.splice(remainingParticipantNames.findIndex(name => name === thisShiftParticipantName), 1);
        const newShiftIndex = newShiftList.participants.findIndex((participant) => {
            const { hours, minutes } = participant.shiftStartTime;
            if (hours === shiftStartTime.hours && minutes === shiftStartTime.minutes) return true;
            return false;
        });
        newShiftList.participants[newShiftIndex].name = thisShiftParticipantName;
    });

    newShiftList.participants = roundShiftMinutesToFive(newShiftList.participants);

    return newShiftList;
}