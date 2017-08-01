import Beacons from 'react-native-beacons-manager';
import {AsyncStorage, DeviceEventEmitter} from 'react-native';
import yawp from 'yawp';

yawp.config(c => {
    c.baseUrl('https://wsgo-beacons.appspot.com/api');
});

let beacons;
let beaconsArray;

const THRESHOLD = 1;

const initBeacons = (settings) => {
    beacons = settings.rooms;
    beaconsArray = Object.keys(beacons).map(key => beacons[key]);
};

const getBeacons = () => beacons;
const getBeaconsArray = () => beaconsArray;

const loadBeacons = (email, cb) => {
    const domain = email.replace(/.*@/, '');
    AsyncStorage.getItem(domain).then(str => {
        if (str) {
            initBeacons(JSON.parse(str));
            cb();
        } else {
            yawp('/settings').where('domain', '=', domain).first(settings => {
                AsyncStorage.setItem(domain, JSON.stringify(settings)).then(() => {
                    initBeacons(settings);
                    cb();
                });
            });
        }
    });
}

const registerBeaconScanner = update => {
    // Beacons.setForegroundScanPeriod(1000);
    // Beacons.setBackgroundScanPeriod(10000);
    // Beacons.setBackgroundBetweenScanPeriod(1);
    Beacons.detectEstimotes();
    Beacons.startRangingBeaconsInRegion('REGION1').then(() => {
        DeviceEventEmitter.addListener('beaconsDidRange', data => {
            // console.log('d', data);
            data.beacons.forEach((b) => {
                if (b.distance < THRESHOLD) {
                    update(b);
                }
            });
        });
    }).catch(error => {
        console.log(`beacon scanner error: ${error}`);
    });
};

const unregisterBeaconScanner = () => {};

const mock = update => {
    setInterval(() => fetch('http://192.168.100.3:3000').then(req => {
        let minor = req._bodyText.trim();
        if (minor !== '-') {
            update({distance: 1, minor: parseInt(minor)});
        }
    }), 750);
};

export {loadBeacons, getBeacons, getBeaconsArray, registerBeaconScanner, unregisterBeaconScanner};
