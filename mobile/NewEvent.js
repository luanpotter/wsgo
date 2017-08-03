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
            name: 'Quick reservation',
            duration: '0:30',
            start: 0,
            end: 100
        };
    }

    onSliderChange = (values) => {
        let start = values[0];
        let end = values[1]
        this.setState({start, end});
    }
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>New Event</Title>
                    </Body>
                </Header>
                <Form style={styles.form}>
                    <Item style={styles.clear} floatingLabel>
                        <Label>Title</Label>
                        <Input value={this.state.name} onChangeText={name => this.setState({name})}/>
                    </Item>
                    <View style={styles.slider}>
                        <MultiSlider touchDimensions={{
                            height: 40,
                            width: 40,
                            borderRadius: 20
                        }} min={0} max={100} sliderLength={300} onValuesChangeFinish={this.onSliderChange} values={[this.state.start, this.state.end]} containerStyle={styles.sliderContainerStyle} selectedStyle={styles.sliderSelectedStyle} unselectedStyle={styles.sliderUnselectedStyle} markerStyle={styles.sliderMarkerStyle} pressedMarkerStyle={styles.sliderPressedMarkerStyle} trackStyle={styles.sliderTrackStyle}/>
                    </View>
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
    clear: {
        marginLeft: 0,
        paddingLeft: 0
    },
    form: {
        padding: 10,
        marginRight: 20,
        marginLeft: 20,
    },
    slider: {
        paddingTop: 80,
        paddingBottom: 30,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sliderTrackStyle: {
        height: 16,
        top: -8,
        borderRadius: 8
    },
    sliderMarkerStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        borderWidth: 0.5,
        borderColor: 'black'
    },
    sliderPressedMarkerStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        borderWidth: 0.5,
        borderColor: 'black'
    },
    sliderSelectedStyle: {
        backgroundColor: '#11aa11'
    },
    sliderUnselectedStyle: {
        backgroundColor: '#aaa'
    },
    sliderContainerStyle: {
        height: 40
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
// </Form >
