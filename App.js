import React from 'react';

import {StyleSheet, View, TextInput} from 'react-native';
import {Container, Button, Text, Icon} from 'native-base';

import {LoginButton} from './Login';

import Room from './Room';
import All from './All';

import PopupDialog from 'react-native-popup-dialog';

import createEvent from './CreateEvent';

const FADE_TIMEOUT = 5000;

import registerBeaconScanner from './utils/BeaconService'
import BEACONS_INFO from './utils/beacons.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            forceAll: false,
            beacons: {}
        };
    }

    forceAll = () => {
        this.setState({forceAll: true});
    };

    componentDidMount() {
        registerBeaconScanner(b => this._updateBeacon(b));
    }

    render() {
        if (!this.state.logged) {
            return (<LoginButton onUserLogged={this._onUserLogged}/>);
        }

        const beacon = this._getCloserBeacon();
        // const beacon = BEACONS_INFO[59504];

        if (!beacon || this.state.forceAll) {
            return <All auth={this.state.token}/>;
        }

        if (!beacon.room) {
            return (
                <View style={styles.container}>
                    <Text>Unknown Beacon</Text>
                </View>
            );
        }

        return (
            <Container style={{
                height: '100%'
            }}>
                <Room auth={this.state.token} beacon={beacon} back={this.forceAll}/>
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%'
                }}>
                    <Button full success onPress={() => this._schedule(beacon)}>
                        <Icon name='add-circle'/>
                        <Text>Schedule Now</Text>
                    </Button>
                </View>
                <PopupDialog ref={(popupDialog) => {
                    this.popupDialog = popupDialog;
                }}>
                    <View>
                        <TextInput label='First Name' placeholder='First Name'/>
                        <Button title="Do schedule!" onPress={() => this._doSchedule()}/>
                    </View>
                </PopupDialog>
            </Container>
        );
    }

    _doSchedule = () => {
        createEvent(this.state.email, this.state.token, this.state.selectedBeacon.room, response => {
            this.popupDialog.dismiss();
        });
    }

    _schedule = (selectedBeacon) => {
        this.setState({selectedBeacon});
        this.popupDialog.show();
    }

    _onUserLogged = (email, token) => {
        this.setState({logged: true, email, token})
    }

    _updateBeacon(b) {
        const beacons = this.state.beacons;
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

        const info = key in BEACONS_INFO
            ? BEACONS_INFO[key]
            : {
                name: 'UNKNOWN'
            };
        Object.assign(beacon, info);

        beacons[key] = beacon;
        this.setState({beacons});
    }

    _clearBeacon(key) {
        const beacons = this.state.beacons;
        delete beacons[key];
        this.setState(beacons);
    }

    _getCloserBeacon() {
        const beacons = Object.keys(this.state.beacons).map(key => this.state.beacons[key]);
        if (!beacons || !beacons.length) {
            return undefined;
        }
        return beacons.reduce((prev, curr) => prev.distance < curr.distance
            ? prev
            : curr);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
