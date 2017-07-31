import moment from 'moment';
import {
    statusString
} from './StatusGenerator.js';

const fetchRoom = (beacon, auth) => {
    // TODO remove mock
    // const now = moment('2017-07-30T12:00:00-03:00');
    const now = moment();

    const d1 = now.format('YYYY-MM-DD');
    const d2 = now.clone()
        .add(+1, 'days')
        .format('YYYY-MM-DD');

    const room = beacon.room;
    const url = `https://content.googleapis.com/calendar/v3/calendars/${room}/events?singleEvents=true&timeMax=${d2}T0%3A00%3A00-03%3A00&timeMin=${d1}T0%3A00%3A00-03%3A00&key=b5IH1R6GRJNWwFxteNYVRDBF`;

    console.log(`curl -H \'Authorization: Bearer ${auth}\' \"${url}\"`);

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

const parseRoom = (responseText, now) => {
    const items = JSON.parse(responseText)
        .items;
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
        .map(e => {
            // console.log('e', e.summary, e.id, e.kind, e.status, e.start);
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
        events
    };

    return room;
};

export default fetchRoom;

export {
    parseRoom
};