import moment from 'moment';

const createEvent = (user, accessToken, roomEmail, cb) => {

    const userEncoded = encodeURIComponent(user);

    const start = moment().format('YYYY-MM-DDTHH:mm:ss-03:00');
    const end = moment().add(+30, 'minutes').format('YYYY-MM-DDTHH:mm:ss-03:00');

    const bodyJson = {
        "end": {
            "dateTime": end
        },
        "start": {
            "dateTime": start
        },
        "summary": "Quick Meeting",
        "attendees": [{
            "email": roomEmail
        }]
    };

    const key = 'b5IH1R6GRJNWwFxteNYVRDBF';

    const url = `https://content.googleapis.com/calendar/v3/calendars/${userEncoded}/events?alt=json&key=${key}`;

    console.log(url);
    console.log(accessToken);

    fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(bodyJson)
    }).then(cb);
};

export default createEvent;
