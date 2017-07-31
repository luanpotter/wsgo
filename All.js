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

export default class All extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rooms: []
        };
    }

    componentDidMount() {
        const keys = Object.keys(BEACONS_INFO);
        const promises = keys.map(v => BEACONS_INFO[v]).map(b => fetchRoom(b, this.props.auth));
        Promise.all(promises).then(rooms => this.setState({rooms}));
    }

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.room !== r2.room
        });
        const rooms = this.state.rooms;
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>All Rooms</Title>
                    </Body>
                    <Right>
                        <Icon name='logo-rss' style={{
                            color: 'gray'
                        }}/>
                    </Right>
                </Header>
                < ListView enableEmptySections={true} dataSource={ds.cloneWithRows(rooms)} renderRow= { e => <Room data={e}/> }/>
            </Container>
        );
    }
}
