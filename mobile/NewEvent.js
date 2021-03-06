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
    Spinner,
    Input,
    Form
} from 'native-base';
import moment from 'moment';
import {humanizeDiff} from './utils/Util';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

const roundUpMinutes = (m) => 5 * Math.ceil(m / 5);
const roundDownMinutes = (m) => 5 * Math.floor(m / 5);

export default class NewEvent extends Component {

    constructor(props) {
        super(props);
        this.state = this.calculateValues([
            0,
            this.findEndFor(props, 30)
        ], props);
        this.state.name = 'Reserva (wsgo)';
        this.state.loading = false;
    }

    findEndFor(dates, minutes) {
        let scale = dates.endDate.diff(dates.startDate, 'minutes');
        return Math.min(100, Math.ceil(100 * minutes / scale));
    }

    calculateValues(values, props) {
        let startTime = values[0];
        let endTime = values[1];

        let fixedStartDate = props.startDate;
        let fixedEndDate = props.endDate;

        let scale = fixedEndDate.diff(fixedStartDate, 'minutes');
        let durationDiff = (endTime - startTime) / 100 * scale;
        let startTimeDiff = startTime / 100 * scale;

        let startDate = moment(fixedStartDate).add(startTimeDiff, 'minutes');
        let endDate = moment(startDate).add(durationDiff, 'minutes');

        startDate.minute(roundUpMinutes(startDate.minute())).second(0);
        endDate.minute(roundDownMinutes(endDate.minute())).second(0);

        // snap
        // startTime = this.findEndFor(props, startDate.diff(props.startDate, 'minutes'));
        // endTime = this.findEndFor(props, endDate.diff(props.startDate, 'minutes'));

        const durationInMinutes = roundUpMinutes(endDate.diff(startDate, 'minutes'));

        return {
            start: startTime,
            end: endTime,
            startDate,
            endDate,
            duration: humanizeDiff(durationInMinutes * 60 * 1000)
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
                        <Title>{this.props.room.title}</Title>
                    </Body>
                </Header>
                <Form style={styles.form}>
                    <Item style={styles.clear} floatingLabel>
                        <Label>Título</Label>
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
                    {!this.state.loading && <Button style={styles.button} iconRight onPress={() => this._schedule()}>
                        <Text>Enviar</Text>
                        <Icon name='cloud-upload'/>
                    </Button>}
                    {this.state.loading && <Spinner style={{
                        marginTop: 15
                    }} color="gray"/>}
                </Form>
            </Container>
        );
    }

    _schedule() {
        const finish = () => this.setState({loading: false});
        this.setState({loading: true});
        this.props.scheduleEvent({name: this.state.name, startDate: this.state.startDate, endDate: this.state.endDate}).then(finish);
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
