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

const Room = (props) => {
    const room = props.room;

    const badgeColor = room.busy
        ? '#aa1111'
        : '#11aa11';
    const badgeText = room.busy
        ? 'Ocupado'
        : 'Livre';

    return (
        <ListItem avatar onPress={() => props.onPress(room.name)}>
            <Left>
                <Icon style={{
                    fontSize: 24,
                    color: 'gray'
                }} name="calendar"/>
            </Left>
            <Body>
                <Text>{room.title}</Text>
                <Text note>{room.statusText}</Text>
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
            <ListView enableEmptySections={true} dataSource={ds.cloneWithRows(rooms)} renderRow={r => <Room onPress={props.onPress} room={r}/>}/>
        </Container>
    );
}
