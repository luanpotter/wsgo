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
    Text,
    Item
    ,Label,Input,Form
} from 'native-base';

export default () => {
    return <Container>
        <Header>
            <Body>
                <Title>New Event</Title>
            </Body>
        </Header>
        <Container>
            <Form>
                <Item floatingLabel>
                  <Label>Name</Label>
                  <Input value="Quick Meeting" />
                </Item>
                <Item floatingLabel last>
                  <Label>Duration</Label>
                  <Input value="0:30"/>
                </Item>
            </Form>
        </Container>
    </Container>;
};
