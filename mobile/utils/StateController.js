import moment from 'moment';
import {BackHandler, ToastAndroid} from 'react-native';

import {loadBeacons, getBeacons, getBeaconsArray, registerBeaconScanner, unregisterBeaconScanner} from './BeaconService';
import {fetchRoom, createEvent} from './CalendarService';

const FADE_TIMEOUT = 5000;
const REFRESH_ROOMS_INTERVAL = 5000;

const INIT_STATE = {
    session: {
        logged: false,
        email: undefined,
        token: undefined
    },
    forceAll: false,
    schedule: false,
    rooms: [],
    currentBeacon: undefined,
    currentRoom: undefined,
    selectedRoom: undefined,
    startDate: undefined,
    endDate: undefined
}

export default class StateController {

    beacons = {};

    constructor(app) {
        this.app = app;
        this.app.state = INIT_STATE;
    }

    mount = () => {
        registerBeaconScanner(currentBeacon => this._updateBeaconInformation(currentBeacon));
        BackHandler.addEventListener('main', () => {
            if (this.app.state.schedule) {
                this.setState({schedule: false});
                return true;
            } else if (this.app.state.currentRoom) {
                this.setState({currentRoom: undefined});
                return true;
            } else {
                return false;
            }
        });
    };

    unmount = () => {
        unregisterBeaconScanner();
        this.roomTimer && clearInterval(this.roomTimer);
        BackHandler.removeEventListener('main');
    };

    forceAll = () => {
        this.setState({forceAll: true, currentRoom: undefined});
    };

    toggleForceAll = () => {
        this.setState({
            forceAll: !this.app.state.forceAll
        });
    };

    createEvent = event => {
        this.setState({schedule: true, startDate: event.startTime, endDate: event.endTime});
    };

    cancelCreateEvent = () => {
        this.setState({schedule: false});
    };

    scheduleEvent = eventData => {
        createEvent(this.app.state.session, this.app.state.currentRoom, eventData).then(data => {
            console.log('Received success ', data);
            const success = data.status === 'confirmed';
            if (success) {
                const update = tryouts => {
                    if (tryouts === 0) {
                        ToastAndroid.show('There was an error fetching your event data, but it seems to have been created.', ToastAndroid.LONG);
                    }
                    this._fetchRooms(() => {
                        const currentRoom = this.app.state.rooms.find(room => room.name === this.app.state.currentRoom.name);
                        const areSame = (ev, evData) => ev.startTime.isSame(evData.startDate) && ev.endTime.isSame(evData.endDate) && ev.text === evData.name;
                        const sameOrganizer = event => event.organizer.email === this.app.state.session.email;
                        const newEventFound = currentRoom.events.some(event => areSame(event, eventData) && sameOrganizer);
                        if (newEventFound) {
                            this.setState({schedule: false, currentRoom});
                            ToastAndroid.show('Successfully created event.', ToastAndroid.SHORT);
                        } else {
                            console.log('Failed to fetch newly created event from the server, let\'s try again shortly.');
                            setTimeout(() => update(tryouts - 1), 250);
                        }
                    });
                };
                update(10);
            } else {
                ToastAndroid.show('The event was created, but the room did not accept.', ToastAndroid.LONG);
            }
        }).catch(error => {
            console.log('Received error ', error);
            ToastAndroid.show('There was an unexpected error: ' + JSON.stringify(error), ToastAndroid.LONG);
        });
    };

    selectRoom = (name) => {
        const rooms = this.app.state.rooms;
        const currentRoom = rooms.find(room => room.name === name);
        this.setState({currentRoom});
    };

    onUserLogged = (email, token) => {
        loadBeacons(email, () => {
            this.setState({
                session: {
                    logged: true,
                    email,
                    token
                }
            });
            this._fetchRooms()
            this.roomTimer = setInterval(() => this._fetchRooms(), REFRESH_ROOMS_INTERVAL);
        });
    }

    _updateBeaconInformation = (b) => {
        const beacons = this.beacons;
        const key = b.minor;

        if (key in beacons) {
            clearTimeout(beacons[key].timer);
        }

        const beacon = {
            distance: b.distance,
            timer: setTimeout(() => {
                this._clearBeacon(key);
            }, FADE_TIMEOUT)
        };

        const info = key in getBeacons()
            ? getBeacons()[key]
            : {
                name: 'UNKNOWN'
            };
        Object.assign(beacon, info);

        beacons[key] = beacon;
        this._setCurrentBeacon();
    };

    _clearBeacon(key) {
        const beacons = this.beacons;
        delete beacons[key];
        this._setCurrentBeacon();
    }

    _setCurrentBeacon = () => {
        const currentBeacon = this._getCloserBeacon();
        const prevBeacon = this.app.state.currentBeacon;

        if (!currentBeacon && prevBeacon) {
            this.setState({currentBeacon: undefined});
        }

        if (currentBeacon && (!prevBeacon || prevBeacon.name !== currentBeacon.name)) {
            this.setState({currentBeacon});
        }
    };

    _getCloserBeacon() {
        const beacons = Object.keys(this.beacons).map(key => this.beacons[key]);
        if (!beacons || !beacons.length) {
            return undefined;
        }
        return beacons.reduce((prev, curr) => prev.distance < curr.distance
            ? prev
            : curr);
    }

    _fetchRooms(cb) {
        const promises = getBeaconsArray().map(b => fetchRoom(b, this.app.state.session.token));

        Promise.all(promises).then(rooms => {
            if (rooms.filter(r => r).length === 0) {
                return;
            }

            const currentBeacon = this.app.state.currentBeacon;
            const updateState = {
                rooms
            };

            if (currentBeacon && !this.app.state.forceAll) {
                updateState.currentRoom = rooms.find(room => room.name === currentBeacon.name);
            }

            this.setState(updateState, cb);
        })
        .catch(err => {
            ToastAndroid.show('Error fetching rooms', ToastAndroid.LONG);
        });
    }

    setState(state, cb) {
        this.app.setState(state, cb);
    }

    startDate() {
        return this.app.state.startDate;
    }

    endDate() {
        return this.app.state.endDate;
    }
}
