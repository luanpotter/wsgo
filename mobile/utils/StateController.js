import {
    loadBeacons,
    getBeacons,
    getBeaconsArray,
    registerBeaconScanner,
    unregisterBeaconScanner
} from './BeaconService';

import { fetchRoom, createEvent } from './CalendarService';

import moment from 'moment';

import { ToastAndroid } from 'react-native';

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
    startDate: moment().hour(6).minute(30).second(0),
    endDate: moment().hour(8).minute(0).second(0)
}

export default class StateController {
    
    beacons = {};

    constructor(app) {
        this.app = app;
        this.app.state = INIT_STATE;
    }

    mount = () => {
        registerBeaconScanner(currentBeacon => this._updateBeaconInformation(currentBeacon));
    };

    umount = () => {
        unregisterBeaconScanner();
    };

    forceAll = () => {
        this.setState({
            forceAll: true,
            currentRoom: undefined
        });
    };

    toggleForceAll = () => {
        this.setState({
            forceAll: !this.app.state.forceAll
        });
    };

    createEvent = event => {
        this.setState({
            schedule: true,
            startDate: event.startTime,
            endDate: event.endTime
        });
    };

    scheduleEvent = eventData => {
        createEvent(this.app.state.session, this.app.state.currentRoom, eventData).then(data => {
            console.log('Received success ', data);
            const success = data.status === 'confirmed';
            if (success) {
                this._fetchRooms(() => {
                    this.setState({
                        schedule: false,
                        currentRoom: this.app.state.rooms.find(room => room.name === this.app.state.currentRoom.name)
                    });
                    ToastAndroid.show('Successfully created event.', ToastAndroid.SHORT);
                });
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
        this.setState({
            currentRoom
        });
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
            setInterval(() => this._fetchRooms(), REFRESH_ROOMS_INTERVAL);
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

        const info = key in getBeacons() ?
            getBeacons()[key] :
            {
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
            this.setState({
                currentBeacon: undefined
            });
        }

        if (currentBeacon && (!prevBeacon || prevBeacon.name !== currentBeacon.name)) {
            this.setState({
                currentBeacon
            });
        }
    };

    _getCloserBeacon() {
        const beacons = Object.keys(this.beacons)
            .map(key => this.beacons[key]);
        if (!beacons || !beacons.length) {
            return undefined;
        }
        return beacons.reduce((prev, curr) => prev.distance < curr.distance ?
            prev :
            curr);
    }

    _fetchRooms(cb) {
        const promises = getBeaconsArray().map(b => fetchRoom(b, this.app.state.session.token));

        Promise.all(promises).then(rooms => {
            if (rooms.filter(r => r).length === 0) {
                return;
            }

            const currentBeacon = this.app.state.currentBeacon;
            const updateState = { rooms };

            if (currentBeacon && !this.app.state.forceAll) {
                updateState.currentRoom = rooms.find(room => room.name === currentBeacon.name);
            }

            this.setState(updateState, cb);
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
