import React, {Component} from 'react';
import {StyleSheet, View, ListView} from 'react-native';
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
    Item,
    Label,
    Input,
    Form
} from 'native-base';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Quick Meeting',
            duration: '0:30'
        };
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>New Event</Title>
                    </Body>
                </Header>
                <View style={styles.form}>
                    <MultiSlider containerStyle={{
                        height: 40
                    }} selectedStyle={{
                        backgroundColor: 'gold'
                    }} unselectedStyle={{
                        backgroundColor: 'silver'
                    }} touchDimensions={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        slipDisplacement: 40
                    }} markerStyle={{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                        backgroundColor: '#E8E8E8',
                        borderWidth: 0.5,
                        borderColor: 'grey'
                    }} trackStyle={styles.sliderTrackStyle} values={[0, 100]} min={0} max={100} sliderLength={300}/>
                </View>
                <Form >
                    <Item floatingLabel>
                        <Label>Name</Label>
                        <Input value="Quick Meeting" onChangeText={name => this.setState({name})}/>
                    </Item>
                    <View style={{
                        backgroundColor: 'red',
                        padding: 40
                    }}></View>
                    <Button onPress={() => this._schedule()}>
                        <Text>Schedule!</Text>
                    </Button>
                </Form>
            </Container>
        );
    }

    _schedule() {
        console.log(this.state, this.props.startTime);
    }

};

const styles = StyleSheet.create({
    form: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderTrackStyle: {
        height: 10,
        backgroundColor: 'red',
        paddingBottom: 4
    }
});

// <Slider style={{
//     width: 300
// }} step={1} minimumValue={0} maximumValue={100} onValueChange={val => this.setState({age: val})}/>

// <Container>
//     <Form>
//         <Item floatingLabel>
//             <Label>Name</Label >
//             <Input value="Quick Meeting" onChangeText={name => this.setState({name})}/>
//         </Item>
//         <Item floatingLabel>
//             <Label>Duration</Label>
//             <Input value="0:30"/>
//         </Item>
//         <Item floatingLabel last>
//             <Label>Test</Label>
//         <Button onPress={() => this._schedule()}>
//             <Text>Schedule!</Text>
//         </Button>
//     </Form>
// </Container>
// ontainer>             </Form >
