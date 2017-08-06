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
import { humanizeDiff } from './utils/Util';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.state = this.calculateValues([0, 100], props);
        this.state.name = 'Quick Reservation';
    }

    calculateValues(values, props) {
        let startTime = values[0];
        let endTime = values[1];

        let fixedStartDate = props.startDate;
        let fixedEndDate = props.endDate;

        let scale = fixedEndDate.diff(fixedStartDate, 'minutes');
        let durationDiff = (endTime - startTime)/100 * scale;
        let startTimeDiff = startTime/100 * scale;

        let startDate = moment(fixedStartDate).add(startTimeDiff, 'minutes').startOf('minute');
        let endDate = moment(startDate).add(durationDiff, 'minutes').startOf('minute');

        return {
            start: startTime,
            end: endTime,
            startDate,
            endDate,
            duration: humanizeDiff(endDate.diff(startDate))
        };
    }

    onSliderChange(values) {
        this.setState(this.calculateValues(values, this.props));
    }

    render() {
        return (
            <Container>
                <Header>
                    <Button transparent onPress={this.props.back}>
                        <Icon name='arrow-back'/>
                    </Button>
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
                            <Text style={styles.periodRange}>{this.state.startDate.format('HH:mm')}</Text>
                            <Text style={styles.periodDuration}>{this.state.duration}</Text>
                            <Text style={styles.periodRange}>{this.state.endDate.format('HH:mm')}</Text>
                        </View>
                    </View>
                    <View style={styles.slider}>
                        <MultiSlider touchDimensions={{
                            height: 40,
                            width: 40,
                            borderRadius: 20
                        }} min={0} max={100} sliderLength={300} onValuesChangeFinish={values => this.onSliderChange(values)} values={[this.state.start, this.state.end]} containerStyle={styles.sliderContainerStyle} selectedStyle={styles.sliderSelectedStyle} unselectedStyle={styles.sliderUnselectedStyle} markerStyle={styles.sliderMarkerStyle} pressedMarkerStyle={styles.sliderPressedMarkerStyle} trackStyle={styles.sliderTrackStyle}/>
                    </View>
                    <Button style={styles.button} iconRight onPress={() => this._schedule()}>
                        <Text>Create Event</Text>
                        <Icon name='cloud-upload'/>
                    </Button>
                </Form>
            </Container>
        );
    }

    _schedule() {
        this.props.scheduleEvent({
            name: this.state.name,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        });
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
