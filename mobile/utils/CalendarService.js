import moment from 'moment';
import {
    statusString
} from './StatusGenerator.js';

const fetchRoom = (beacon, auth) => {
    const now = moment();

    const d1 = now.format('YYYY-MM-DD');
    const d2 = now.clone()
        .add(+1, 'days')
        .format('YYYY-MM-DD');

    const room = beacon.room;
    const url = `https://content.googleapis.com/calendar/v3/calendars/${room}/events?singleEvents=true&timeMax=${d2}T0%3A00%3A00-03%3A00&timeMin=${d1}T0%3A00%3A00-03%3A00&key=b5IH1R6GRJNWwFxteNYVRDBF`;

    // console.log(`curl -H \'Authorization: Bearer ${auth}\' \"${url}\"`);
    console.log('room', beacon.title);

    return fetch(url, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
        .then(response => ({
            name: beacon.name,
            title: beacon.title,
            ...parseRoom(response._bodyText, now)
        }));
};

const injectFreeSlots = (now, events) => {
    if (!now) {
        return events;
    }

    const result = [];
    let prev;

    events.forEach(curr => {
        if (!curr.startTime || !curr.endTime) {
            return events;
        }
        if (prev) {
            if (prev.endTime.isBefore(curr.startTime)) {
                result.push({
                    free: true,
                    displayTime: prev.endTime.format('HH:mm'),
                    startTime: prev.endTime,
                    endTime: curr.startTime
                });
            }
        } else {
            if (curr.startTime.isAfter(now)) {
                result.push({
                    free: true,
                    displayTime: now.format('HH:mm'),
                    startTime: now.clone(),
                    endTime: curr.startTime
                });
            }
        }
        result.push(curr);
        prev = curr;
    });

    if (events.length === 0) {
        result.push({
            free: true,
            displayTime: now.format('HH:mm'),
            startTime: now.clone(),
            endTime: now.clone()
                .add(1, 'days')
                .startOf('day')
        });
    }
    else {
        const last = events[events.length - 1];
        const endOfDay = now.clone()
            .add(1, 'days')
            .startOf('day')

        if (last.endTime.isBefore(endOfDay)) {
            result.push({
                free: true,
                displayTime: last.endTime.format('HH:mm'),
                startTime: last.endTime,
                endTime: endOfDay
            });
        }
    }

    return result;
};

const parseRoom = (responseText, now, title) => {
    const items = JSON.parse(responseText)
        .items;

    if (!items) {
        return;
    }

    const date = d => (d && d.dateTime) ? moment(d.dateTime)
        .format('HH:mm') : 'All Day';

    const checkActive = (e) => {
        if (!now) {
            return false;
        }
        if (!e.start || !e.end) {
            return true;
        }
        return moment(e.start.dateTime)
            .isSameOrBefore(now) && moment(e.start.endTime)
            .isSameOrAfter(now);
    };

    const extractOrganizer = (e) => {
        if (e.visibility === 'private') {
            return {
                name: 'Private',
                email: ''
            }
        }
        return e.organizer ? {
            name: e.organizer.displayName ? e.organizer.displayName : e.organizer.email,
            email: e.organizer.email
        } : {
            name: '',
            email: ''
        };
    };

    const events = items
        .map(e => {
            e.startTime = e.start ? moment(e.start.dateTime) : undefined;
            e.endTime = e.end ? moment(e.end.dateTime) : undefined;
            return e;
        })
        .filter(e => {
            if (!now || !e.end) {
                return true;
            }
            return e.endTime.isSameOrAfter(now);
        })
        .filter(e => {
            if (e.visibility === 'private') {
                return true;
            }
            const self = e.attendees.find(a => a.self);
            return self && self.responseStatus === 'accepted'
        })
        .map(e => {
            return {
                text: e.summary,
                displayTime: date(e.start),
                startTime: e.startTime,
                endTime: e.endTime,
                organizer: extractOrganizer(e),
                active: checkActive(e)
            }
        });

    events.sort((e1, e2) => e1.displayTime.localeCompare(e2.displayTime));

    const room = {
        busy: events.some(e => e.active),
        statusText: statusString(now, events),
        events: injectFreeSlots(now, events)
    };

    return room;
};

export default fetchRoom;

export {
    parseRoom
};
