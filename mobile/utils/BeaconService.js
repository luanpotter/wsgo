import Beacons from 'react-native-beacons-manager';
import {AsyncStorage, DeviceEventEmitter} from 'react-native';
import yawp from 'yawp';

yawp.config(c => {
    c.baseUrl('https://2-dot-wsgo-beacons.appspot.com/api');
});

let beacons;
let beaconsArray;

const THRESHOLD = 1;

const initBeacons = settings => {
    beaconsArray = settings.rooms;
    beacons = beaconsArray.filter(e => e.beacon).reduce((total, el) => ({ [el.beacon]: el, ...total }), {});
};

const getBeacons = () => beacons;
const getBeaconsArray = () => beaconsArray;

const EXPIRATION_TIME = 1000 * 60 * 60 * 4;

const fetch = domain => new Promise(resolve => {
    AsyncStorage.getItem(domain).then(str => {
        if (str) {
            const settings = JSON.parse(str);
            if (settings.date && Date.now() - settings.date <= EXPIRATION_TIME) {
                resolve(settings);
                return;
            }
        }
        console.log("Fetching Settings from Server...");
        yawp("/settings").where("domain", "=", domain).first(settings => {
            console.log("Fetch!");
            settings.date = Date.now();
            AsyncStorage.setItem(domain, JSON.stringify(settings)).then(() => resolve(settings));
        });
    });
});

const loadBeacons = (email, cb) => {
    const domain = email.replace(/.*@/, '');
    fetch(domain).then(settings => {
        initBeacons(settings);
        cb();
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
