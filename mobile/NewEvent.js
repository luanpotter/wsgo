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
import moment from 'moment';

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

    onSliderChange(values) {
        let start = values[0];
        let end = values[1]
        this.setState({start, end});
    }

    convertDates(startDate, endDate, startTime, endTime) {
        let scale = endDate.diff(startDate, 'minutes');
        let diff = (endTime - startTime)/100 * scale;
        let startTime = startTime/100 * scale;
        return {
            start: startDate.add(startTime, 'minutes'),
            end: moment(startDate).add(diff, 'minutes')
        }
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
                    <View style={styles.periodContainer}>
                        <View style={styles.period}>
                            <Text style={styles.periodRange}>10:00</Text>
                            <Text style={styles.periodDuration}>1 hora e 30 minutos</Text>
                            <Text style={styles.periodRange}>14:00</Text>
                        </View>
                    </View>
                    <View style={styles.slider}>
                        <MultiSlider touchDimensions={{
                            height: 40,
                            width: 40,
                            borderRadius: 20
                        }} min={0} max={100} sliderLength={300} onValuesChangeFinish={this.onSliderChange} values={[this.state.start, this.state.end]} containerStyle={styles.sliderContainerStyle} selectedStyle={styles.sliderSelectedStyle} unselectedStyle={styles.sliderUnselectedStyle} markerStyle={styles.sliderMarkerStyle} pressedMarkerStyle={styles.sliderPressedMarkerStyle} trackStyle={styles.sliderTrackStyle}/>
                    </View>
                    <Button style={styles.button} iconRight>
                        <Text>Create Event</Text>
                        <Icon name='cloud-upload'/>
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
        marginLeft: 20
    },
    periodContainer: {
        marginTop: 40
    },
    periodLabel: {
        fontSize: 15,
        paddingLeft: 2,
        color: '#868686',
        marginBottom: 10
    },
    period: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 6,
        borderBottomWidth: 0.5,
        borderColor: '#D9D5DC',
        borderStyle: 'solid'
    },
    periodRange: {
        fontSize: 20,
        color: '#444',
        fontWeight: 'bold'
    },
    periodDuration: {
        paddingTop: 3,
        fontSize: 14,
        color: '#aaa'
    },
    slider: {
        marginTop: 60,
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
    button: {
        marginTop: 40,
        alignSelf: 'center'
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
