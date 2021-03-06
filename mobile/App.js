import React, {Component} from 'react';

import {StyleSheet, View, TextInput} from 'react-native';
import {Container, Button, Text, Icon} from 'native-base';

import {LoginButton, loginHandler} from './Login';
import StateController from './utils/StateController'

import Room from './Room';
import All from './All';
import NewEvent from './NewEvent';

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
                {this.state.schedule && <NewEvent room={room} back={this.ctrl.cancelCreateEvent} startDate={this.ctrl.startDate()} endDate={this.ctrl.endDate()} scheduleEvent={this.ctrl.scheduleEvent} />}
                {!this.state.schedule && <Room room={room} back={this.ctrl.forceAll} schedule={this.ctrl.createEvent}/>}
            </Container>
        );
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
