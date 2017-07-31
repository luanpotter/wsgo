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
    Text
} from 'native-base';

import md5 from 'blueimp-md5';
import moment from 'moment';

import fetchRoom from './utils/CalendarService';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.summary !== r2.summary
});

const Event = (props) => {
    const e = props.data;

    const hash = md5(e.organizer.email);
    const uri = `https://www.gravatar.com/avatar/${hash}?s=400`;

    return (
        <ListItem avatar>
            <Left>
                <Thumbnail source={{
                    uri
                }}/>
            </Left>
            <Body>
                <Text>{e.organizer.name}</Text>
                <Text note>{e.text}</Text>
            </Body>
            <Right>
                <Text note>{e.displayTime}</Text>
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
        paddingBottom: 50
    }
});
