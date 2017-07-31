import { statusString } from './StatusGenerator';
import moment from 'moment';

const now = moment('2017-01-01T13:00:00');

const HOUR = 60;
const minutes = dt => now.clone().add(dt, 'minute');
const oneHourEvt = dt => ({ startTime: minutes(dt), endTime: minutes(dt + HOUR) });

it('single event in the future', () => {
    const status = statusString(now, [oneHourEvt(HOUR)]);
    expect(status).toBe('Livre até 14:00');
});

it('one now and one later', () => {
    const status = statusString(now, [oneHourEvt(-30), oneHourEvt(+2*HOUR)]);
    expect(status).toBe('Ocupada até 13:30');
});

it('events in the past', () => {
    const status = statusString(now, [oneHourEvt(-3 * HOUR), oneHourEvt(-2 * HOUR)]);
    expect(status).toBe('Livre o dia todo');
});

it('only event now', () => {
	const status = statusString(now, [oneHourEvt(-30)]);
	expect(status).toBe('Ocupada até 13:30');
});

it('event now and some in the future', () => {
    const status = statusString(now, [oneHourEvt(-30), oneHourEvt(+30)]);
    expect(status).toBe('Ocupada até 14:30');
});

it('no event now and one in the future', () => {
    const status = statusString(now, [oneHourEvt(+30)]);
    expect(status).toBe('Livre até 13:30');
});

it('no event now and some in the future', () => {
    const status = statusString(now, [oneHourEvt(+30), oneHourEvt(HOUR + 30)]);
    expect(status).toBe('Livre até 13:30');
});