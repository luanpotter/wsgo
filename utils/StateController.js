import {
    BEACONS_INFO,
    BEACONS_INFO_ARRAY
} from './beacons.js';

import {
    registerBeaconScanner,
    unregisterBeaconScanner
} from './BeaconService';

import fetchRoom from './CalendarService';

const FADE_TIMEOUT = 5000;
const REFRESH_ROOMS_INTERVAL = 5000;

const INIT_STATE = {
    session: {
        logged: false,
        email: undefined,
        token: undefined
    },
    forceAll: false,
    currentBeacon: undefined,
    rooms: []
}

export default class StateController {


    beacons = {};

    constructor(app) {
        this.app = app;
        this.app.state = INIT_STATE;
    }

    mount = () => {
        registerBeaconScanner(currentBeacon => this._updateCurrentBeacon(currentBeacon));
    };

    umount = () => {
        unregisterBeaconScanner();
    };

    forceAll = () => {
        console.log('ha');
        this.setState({
            forceAll: true
        });
    };

    onUserLogged = (email, token) => {
        this.setState({
            session: {
                logged: true,
                email,
                token
            }
        });
        this._fetchRooms()
        setInterval(() => this._fetchRooms(), REFRESH_ROOMS_INTERVAL);
    }

    _updateCurrentBeacon = (b) => {
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

        const info = key in BEACONS_INFO ?
            BEACONS_INFO[key] :
            {
                name: 'UNKNOWN'
            };
        Object.assign(beacon, info);

        beacons[key] = beacon;
        const currentBeacon = this._getCloserBeacon();

        if (this.app.state.currentBeacon === undefined || this.app.state.currentBeacon.name !== currentBeacon.name) {
            this.setState({
                currentBeacon
            });
        }
    };

    _clearBeacon(key) {
        const beacons = this.beacons;
        delete beacons[key];
        this.setState(beacons);
    }

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
        const promises = BEACONS_INFO_ARRAY.map(b => fetchRoom(b, this.app.state.session.token));
        Promise.all(promises)
            .then(rooms => {
                const currentBeacon = this.app.state.currentBeacon;

                const updateState = {
                    rooms
                };
                if (currentBeacon) {
                    updateState.currentRoom = rooms.find(room => room.name === currentBeacon.name);
                }

                this.setState(updateState);
            });
    }

    setState(state) {
        this.app.setState(state);
    }

}
