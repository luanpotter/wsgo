import {
    loadBeacons,
    getBeacons,
    getBeaconsArray,
    registerBeaconScanner,
    unregisterBeaconScanner
} from './BeaconService';

import fetchRoom from './CalendarService';

import moment from 'moment';

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

    createEvent = (event) => {
        this.setState({
            schedule: true,
            startDate: event.startTime,
            endDate: event.endTime
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

    _fetchRooms() {
        const promises = getBeaconsArray()
            .map(b => fetchRoom(b, this.app.state.session.token));

        Promise.all(promises)
            .then(rooms => {

                if (rooms.filter(r => r)
                    .length === 0) {
                    return;
                }

                const currentBeacon = this.app.state.currentBeacon;

                const updateState = {
                    rooms
                };

                if (currentBeacon && !this.app.state.forceAll) {
                    updateState.currentRoom = rooms.find(room => room.name === currentBeacon.name);
                }

                this.setState(updateState);
            });
    }

    setState(state) {
        this.app.setState(state);
    }

    startDate() {
        return this.app.state.startDate;
    }

    endDate() {
        return this.app.state.endDate;
    }
}
