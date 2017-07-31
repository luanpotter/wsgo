const calculateStatus = (now, events) => {
    const all = events.map((e, i) => ({ e, i })).filter(o => o.e.startTime.isBefore(now));
    const index = all.length > 0 ? all.pop().i : 0;
    const somethingNow = events[index].startTime.isBefore(now) && events[index].endTime.isAfter(now);

    let lastEvent;
    let lastIndex;
    for (let i = index; i < events.length; i++) {
        let event = events[i];
        if (somethingNow && lastEvent && !lastEvent.endTime.isSame(event.startTime)) {
            return [somethingNow, lastEvent.endTime];
        }

        if (!somethingNow && event.startTime.isAfter(now)) {
            return [somethingNow, event.startTime];
        }
        lastEvent = event;
    }
    return [somethingNow, !somethingNow ? undefined : events[events.length - 1].endTime];
}

const statusString = (now, events) => {
    const free = 'Livre o dia todo';

    if (events.length === 0) {
        return free;
    }
    if (events.some(e => !e.startTime || !e.endTime)) {
        return 'Ocupado o dia todo';
    }

    const [somethingNow, freeTime] = calculateStatus(now, events);

    if (!freeTime) {
        return free;
    }

    // moment.fromNow() is interesting too
    return (somethingNow ? 'Ocupada até ' : 'Livre até ') + freeTime.format('HH:mm');
}

export { statusString, calculateStatus };