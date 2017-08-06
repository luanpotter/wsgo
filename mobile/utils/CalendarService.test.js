import moment from 'moment';
import { response1 } from './CalendarService.mock';
import { parseRoom } from './CalendarService';

const responseText = JSON.stringify(response1);

describe('#parseRoom', () => {
    it('returns room info', () => {
        const room = parseRoom(responseText);

        expect(room.events.length)
            .toBe(5);

        const event = room.events[0];

        expect(event.text)
            .toBe('Entrevista Roberto Alves');

        expect(event.displayTime)
            .toBe('09:00');

        expect(event.organizer.name)
            .toBe('juliana.pessoto@dextra-sw.com');

        expect(event.organizer.email)
            .toBe('juliana.pessoto@dextra-sw.com');

    });

    it('ignores old events and marks current event', () => {
        const room = parseRoom(responseText, moment('2017-07-27T10:20:00-03:00'));

        expect(room.events.length)
            .toBe(6);

        expect(room.events[0].organizer.name)
            .toBe('Marcel Danilo Canova Falcao');

        expect(room.events[0].active)
            .toBeTruthy();

        expect(room.events[1].active)
            .toBeFalsy();
    });

    it('marks free slots between meetings', () => {
        const room = parseRoom(responseText, moment('2017-07-27T10:20:00-03:00'));

        expect(room.events.length)
            .toBe(6);

        expect(room.events[0].free)
            .toBeFalsy();

        expect(room.events[2].free)
            .toBeTruthy();

        expect(room.events[5].free)
            .toBeTruthy();
    });

});
