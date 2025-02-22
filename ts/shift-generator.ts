export interface ShiftTime {
    hours: number;
    minutes: number;
}

export interface ShiftParticipant {
    name: string;
    shiftStartTime: ShiftTime;
    shiftEndTime: ShiftTime;
}

export interface ShiftList {
    firstShiftStartTime: ShiftTime;
    lastShiftEndTime: ShiftTime;
    participants: ShiftParticipant[];
    shiftedNumber: number;
    timestamp?: string;
}

function roundShiftMinutesToFive(shiftParticipants: ShiftParticipant[]): ShiftParticipant[] {
    const newShiftParticipants: ShiftParticipant[] = JSON.parse(JSON.stringify(shiftParticipants));

    // Round all participants shiftEndTime.minutes.
    // Also sets next participants shiftStartTime property to equal current participants shiftEndTime property.
    for (let i = 0; i < newShiftParticipants.length - 1; i++) {
        const roundedMinutes = Math.ceil(newShiftParticipants[i].shiftEndTime.minutes / 5) * 5;
        newShiftParticipants[i].shiftEndTime.minutes = roundedMinutes;

        newShiftParticipants[i + 1].shiftStartTime = newShiftParticipants[i].shiftEndTime;

        // If roundedMinutes is 60 we need to increment newShiftParticipants[i].shiftEndTime.hours.
        if (roundedMinutes < 60) continue;

        newShiftParticipants[i].shiftEndTime.minutes = roundedMinutes % 60;
        const newShiftEndHours = newShiftParticipants[i].shiftEndTime.hours += Math.floor(roundedMinutes / 60);

        if (newShiftEndHours >= 24) newShiftParticipants[i].shiftEndTime.hours = newShiftEndHours % 24;
    }

    return newShiftParticipants;
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

    const fullShiftLengthInMinutes = Math.abs(firstShiftStartTime.getTime() - lastShiftEndTime.getTime()) / 1000 / 60;
    const shiftDurationInMinutes = fullShiftLengthInMinutes / shiftList.participants.length;

    // Create ShiftParticipant array that includes all shift start and end times, but leave participant names empty.
    const newShiftParticipantArray: ShiftParticipant[] = new Array(shiftList.participants.length).fill(null).map((value, index) => {
        const lastShiftEndTimeMinutes = (firstShiftStartTime.getHours() * 60 + firstShiftStartTime.getMinutes()) + shiftDurationInMinutes * index;
        return {
            name: "",
            shiftStartTime: {
                hours: Math.floor(lastShiftEndTimeMinutes / 60) % 24,
                minutes: Math.floor(lastShiftEndTimeMinutes % 60)
            },
            shiftEndTime: {
                hours: Math.floor((lastShiftEndTimeMinutes + shiftDurationInMinutes) / 60) % 24,
                minutes: Math.floor((lastShiftEndTimeMinutes + shiftDurationInMinutes) % 60)
            }
        };
    });

    return roundShiftMinutesToFive(newShiftParticipantArray);
}

function generateRandomShifts(shiftList: ShiftList): ShiftParticipant[] {
    const participantsNames = shiftList.participants.map(({ name }) => name);

    const emptyShiftList = generateEmptyShifts(shiftList);

    // Add all of the participants names to randomly selected participants with shifts.
    return emptyShiftList.map(shiftParticipant => {
        const participantNameIndex = Math.floor(Math.random() * participantsNames.length);
        shiftParticipant.name = participantsNames[participantNameIndex];
        participantsNames.splice(participantNameIndex, 1);
        return shiftParticipant;
    });
}

function shiftParticipantsNames(participantsNames: string[], numberOfShifts: number): string[] {
    const newParticipantsNames = [...participantsNames];

    for (let i = 0; i < numberOfShifts; i++) {
        newParticipantsNames.unshift(newParticipantsNames.splice(newParticipantsNames.length - 1, 1)[0]);
    }

    return newParticipantsNames;
}

export default function generateShifts(shiftList: ShiftList, shiftListHistory?: ShiftList[], randomShifts?: boolean): ShiftList {
    // This makes a new copy of shiftList so that changes won't affect the original object.
    const newShiftList: ShiftList = {
        ...JSON.parse(JSON.stringify(shiftList)),
        participants: generateEmptyShifts(shiftList),
        shiftedNumber: 0,
        timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString()
    };

    if (randomShifts || !shiftListHistory || shiftListHistory.length < 1) {
        newShiftList.participants = generateRandomShifts(shiftList);
        return newShiftList;
    }

    let previouslyShifted: { shiftedNumber: number; count: number }[] = [];

    let baseShiftListIndex = 0;

    // Create shiftListHistory array where its shiftList rows only contain participants names.
    const shiftListHistoryParticipantsNames = shiftListHistory.map(
        ({ participants }) => participants.map(({ name }) => name)
    );

    // Search the last shiftList that had its participants names or length changed.
    for (let i = shiftListHistoryParticipantsNames.length - 1; i > 0; i--) {
        if (shiftListHistory[i].participants.length !== shiftListHistory[i - 1].participants.length) {
            baseShiftListIndex = i;
            break;
        }

        const participantsNamesChanged = shiftListHistoryParticipantsNames[i].some(
            participantName => !shiftListHistoryParticipantsNames[i - 1].includes(participantName)
        );

        if (participantsNamesChanged) {
            baseShiftListIndex = i;
            break;
        }
    }
    
    // If the current shiftList.participants.length is not changed from the previous one then
    // count and add all previously shifted numbers starting from the next index of baseShiftListIndex to previouslyShifted array
    // except the ones that are larger than or equal to the current shiftList.participants.length.
    if (shiftList.participants.length === shiftListHistory[shiftListHistory.length - 1].participants.length) {
        for (let i = baseShiftListIndex + 1; i < shiftListHistory.length; i++) {
            const previouslyShiftedIndex = previouslyShifted.findIndex(
                ({ shiftedNumber }) => shiftedNumber === shiftListHistory[i].shiftedNumber
            );
    
            if (previouslyShiftedIndex > -1) previouslyShifted[previouslyShiftedIndex].count++;
            else if (shiftListHistory[i].shiftedNumber < shiftList.participants.length) {
                if (shiftListHistory[i].shiftedNumber === 0) continue;
                previouslyShifted.push({ shiftedNumber: shiftListHistory[i].shiftedNumber, count: 1 });
            }
        }
    }

    // Add all possible shift numbers that are not already in the previouslyShifted array.
    for (let i = 1; i < shiftList.participants.length; i++) {
        if (previouslyShifted.find(({ shiftedNumber }) => shiftedNumber === i)) continue;
        previouslyShifted.push({ shiftedNumber: i, count: 0 });
    }

    // Sort by ascending order.
    previouslyShifted.sort(({ count: a }, { count: b }) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });

    // Leave all elements with the same count as the first element and delete the rest.
    // The first element is the most suitable number of shifts (there can be multiple elements).
    for (let i = 1; i < previouslyShifted.length; i++) {
        if (previouslyShifted[i].count > previouslyShifted[i - 1].count) previouslyShifted.splice(i);
    }

    // If all possible shifts are made and the last shifted number is more than 0 then
    // clear previouslyShifted array and add only the baseShiftList.shiftedNumber (which is 0).
    if (previouslyShifted.length === shiftList.participants.length - 1 && shiftListHistory[shiftListHistory.length - 1].shiftedNumber > 0) {
        previouslyShifted = [{ shiftedNumber: 0, count: 0 }];
    }

    let mostSuitableNumberOfShifts = Math.floor(Math.random() * (shiftList.participants.length - 1)) + 1;

    if (previouslyShifted.length > 0) {
        const randomlySelectedIndex = Math.floor(Math.random() * previouslyShifted.length);
        mostSuitableNumberOfShifts = previouslyShifted[randomlySelectedIndex].shiftedNumber;
    }

    const baseShiftList = shiftListHistory[baseShiftListIndex];

    let baseParticipantsNames = baseShiftList
        ? baseShiftList.participants.map(({ name }) => name)
        : shiftListHistory[0].participants.map(({ name }) => name);

    const shiftListParticipantsLengthOrNamesChanged = (
        shiftList.participants.length !== baseShiftList.participants.length ||
        shiftList.participants.some(({ name }) => !baseParticipantsNames.includes(name))
    );

    // If shiftList.participants names or length is changed then use participants names from shiftList.participants.
    if (shiftListParticipantsLengthOrNamesChanged) {
        baseParticipantsNames = shiftList.participants.map(({ name }) => name);
    }

    const shiftedParticipantsNames = shiftParticipantsNames(baseParticipantsNames, mostSuitableNumberOfShifts);

    newShiftList.shiftedNumber = !shiftListParticipantsLengthOrNamesChanged
        ? mostSuitableNumberOfShifts
        : 0;

    // Assign the most suitable participants (first element in the shiftChanceArray rows) to the new shift list shifts.
    for (let shiftIndex = 0; shiftIndex < newShiftList.participants.length; shiftIndex++) {
        newShiftList.participants[shiftIndex].name = shiftedParticipantsNames[shiftIndex];
    }

    return newShiftList;
}