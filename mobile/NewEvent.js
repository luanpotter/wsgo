import React, {Component} from 'react';
import {View, ListView, Slider} from 'react-native';
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

export default class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = { name: 'Quick Meeting', duration: '0:30' };
    }

    render() {
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
                      <Input value="Quick Meeting" onChangeText={name => this.setState({ name })}/>
                    </Item>
                    <Item floatingLabel>
                      <Label>Duration</Label>
                      <Input value="0:30"/>
                    </Item>
                    <Item floatingLabel last>
                        <Label>Test</Label>
                        <Slider 
                                 style={{ width: 300 }}
         step={1}
         minimumValue={18}
         maximumValue={71}
         value={28}
         onValueChange={val => this.setState({ age: val })}
                         />
                    </Item>
                    <Button onPress={() => this._schedule()}>
                        <Text>Schedule!</Text>
                    </Button>
                </Form>
            </Container>
        </Container>;
    }

    _schedule() {
        console.log(this.state, this.props.startTime);
    }
};
