import moment from 'moment';
import {AppState, BackHandler, ToastAndroid} from 'react-native';

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
    endDate: undefined,
    appState: AppState.currentState
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
                this.setState({forceAll: true, currentRoom: undefined});
                return true;
            } else {
                return false;
            }
        });

        AppState.addEventListener('change', (nextAppState) => {
            if (this.app.state.appState.match(/inactive|background/) && nextAppState === 'active') {
                this.setState({forceAll: false, appState: nextAppState});
            } else {
                this.setState({appState: nextAppState})
            }
        });
    };

    unmount = () => {
        unregisterBeaconScanner();
        this.roomTimer && clearInterval(this.roomTimer);
        BackHandler.removeEventListener('main');
        AppState.removeEventListener('change');
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
        return new Promise(resolve => {
            createEvent(this.app.state.session, this.app.state.currentRoom, eventData).then(data => {
                console.log('Received success ', data);
                const success = data.status === 'confirmed';
                if (success) {
                    const update = tryouts => {
                        if (tryouts === 0) {
                            ToastAndroid.show('There was an error fetching your event data, but it seems to have been created.', ToastAndroid.LONG);
                        }
                        this._fetchRooms(() => {
                            const currentRoom = this.app.state.rooms.find(room => room.title === this.app.state.currentRoom.title);
                            const newEventFound = currentRoom.events.some(event => event.id === data.id);
                            if (newEventFound) {
                                this.setState({schedule: false, currentRoom});
                                ToastAndroid.show('Evento criado com sucesso.', ToastAndroid.SHORT);
                            } else {
                                console.log('Failed to fetch newly created event from the server, let\'s try again shortly.');
                                setTimeout(() => update(tryouts - 1), 250);
                            }
                        });
                    };
                    update(10);
                } else {
                    ToastAndroid.show('A sala recusou o evento.', ToastAndroid.LONG);
                    resolve();
                }
            }).catch(error => {
                console.log('Received error ', error);
                ToastAndroid.show('Erro inesperado: ' + JSON.stringify(error), ToastAndroid.LONG);
                resolve();
            });
        });
    };

    selectRoom = (title) => {
        const rooms = this.app.state.rooms;
        const currentRoom = rooms.find(room => room.title === title);
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

        const info = key in getBeacons() ? getBeacons()[key] : {
            title: 'UNKNOWN'
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

        if (currentBeacon && (!prevBeacon || prevBeacon.title !== currentBeacon.title)) {
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
            const updateState = { rooms };

            if (currentBeacon && !this.app.state.forceAll) {
                updateState.currentRoom = rooms.find(room => room.title === currentBeacon.title);
            }

            this.setState(updateState, cb);
        }).catch(err => {
            console.error('Error fetching rooms.', err)
            ToastAndroid.show('Error fetching rooms; ' + JSON.stringify(err), ToastAndroid.LONG);
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
