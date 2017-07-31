import React from 'react';
import {View, ListView} from 'react-native';

import {
    Container,
    Header,
    Title,
    Content,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Icon,
    Button,
    Badge,
    Switch,
    Grid,
    Text
} from 'native-base';

import BEACONS_INFO from './utils/beacons.js';
import fetchRoom from './utils/CalendarService';

const Room = (props) => {
    const e = props.data;

    const badgeColor = e.busy
        ? '#aa1111'
        : '#11aa11';
    const badgeText = e.busy
        ? 'Ocupado'
        : 'Livre';

    return (
        <ListItem avatar>
            <Left>
                <Icon style={{
                    fontSize: 24,
                    color: 'gray'
                }} name="calendar"/>
            </Left>
            <Body>
                <Text>{e.title}</Text>
                <Text note>{e.statusText}</Text>
            </Body>
            <Right>
                <Badge style={{
                    backgroundColor: badgeColor
                }}>
                    <Text>{badgeText}</Text>
                </Badge>
            </Right>
        </ListItem>
    );
};

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.room !== r2.room
});

export default function(props) {

    const rooms = props.rooms;
    const toggleColor = props.forceAll
        ? 'gray'
        : 'white';

    return (
        <Container>
            <Header>
                <Body>
                    <Title>All Rooms</Title>
                </Body>
                <Right>
                    <Button transparent onPress={props.toggleForceAll}>
                        <Icon name='logo-rss' style={{
                            color: toggleColor
                        }}/>
                    </Button>
                </Right>
            </Header>
            <ListView enableEmptySections={true} dataSource={ds.cloneWithRows(rooms)} renderRow= { e => <Room data={e}/> }/>
        </Container>
    );
}
