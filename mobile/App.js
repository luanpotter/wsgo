import React, {Component} from 'react';

import {StyleSheet, View, TextInput} from 'react-native';
import {Container, Button, Text, Icon} from 'native-base';
import PopupDialog from 'react-native-popup-dialog';

import {LoginButton, loginHandler} from './Login';
import StateController from './utils/StateController'

import Room from './Room';
import All from './All';
import NewEvent from './NewEvent';

import registerBeaconScanner from './utils/BeaconService'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.ctrl = new StateController(this);
    }

    componentDidMount() {
        this.ctrl.mount();
        loginHandler(this.ctrl.onUserLogged);
    }

    componentWillUnmount() {
        this.ctrl.unmount();
    }

    render() {
        if (!this.state.session.logged) {
            return null;
        }

        const room = this.state.currentRoom;

        if (!room) {
            return <All rooms={this.state.rooms} onPress={this.ctrl.selectRoom} forceAll={this.state.forceAll} toggleForceAll={this.ctrl.toggleForceAll}/>;
        }

        return (
            <Container style={{
                height: '100%'
            }}>
                {this.state.schedule && <NewEvent/>}
                {!this.state.schedule && <Room room={room} back={this.ctrl.forceAll} schedule={this.ctrl.createEvent}/>}
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

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
