import React from 'react';
import {StyleSheet, ListView} from 'react-native';

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
    Button,
    Icon,
    Badge,
    Text
} from 'native-base';

import md5 from 'blueimp-md5';
import moment from 'moment';
import humanizeDuration from 'humanize-duration'

import fetchRoom from './utils/CalendarService';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.summary !== r2.summary
});

const createUriFor = (e) => {
    if (e.free) {
        return '';
    }
    const hash = md5(e.organizer.email);
    return `https://www.gravatar.com/avatar/${hash}?s=400`;
};

const Event = (props) => {
    const e = props.data;
    const uri = createUriFor(e);

    const title = e.free
        ? 'Livre'
        : e.organizer.name;
    const note = e.free
        ? humanizeDuration(moment.duration(e.endTime.diff(e.startTime)), { largest: 2, delimiter: ' e ', language: 'pt'})
        : e.text;
    const badgeColor = !e.free
        ? '#aa1111'
        : '#11aa11';

    const bgColor = e.free
        ? '#eeffee'
        : null;


    console.log('e', e.startTime.format(), e.endTime.format());
    return (
        <ListItem avatar style={{
            backgroundColor: bgColor,
            marginLeft: 0
        }}>
            <Left style={{
                marginLeft: 10
            }}>
                {!e.free && <Thumbnail source={{
                    uri
                }}/>}
                {e.free && <Icon name='add-circle' style={{
                    color: '#11aa11',
                    fontSize: 50,
                    width: 55,
                    textAlign: 'center'
                }}/>}
            </Left>
            <Body>
                <Text>{title}</Text>
                <Text note>{note}</Text>
            </Body>
            <Right>
                <Badge style={{
                    backgroundColor: badgeColor
                }}>
                    <Text>{e.displayTime}</Text>
                </Badge>
            </Right>
        </ListItem>
    );
};

export default function(props) {
    const room = props.room;

    if (!room) {
        return null;
    }

    return (
        <Container style={styles.container}>
            <Header>
                <Button transparent onPress={props.back}>
                    <Icon name='arrow-back'/>
                </Button>
                <Body>
                    <Title>{room.title}</Title>
                </Body>
            </Header>
            <ListView enableEmptySections={true} dataSource={ds.cloneWithRows(room.events)} renderRow={e => <Event data={e}/>}/>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
    }
});
