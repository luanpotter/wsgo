import Beacons from 'react-native-beacons-manager';
import {DeviceEventEmitter} from 'react-native';

const THRESHOLD = 2.75;

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

const unregisterBeaconScanner = () => {

};

const mock = update => {
    setInterval(() => fetch('http://192.168.100.3:3000').then(req => {
        let minor = req._bodyText.trim();
        if (minor !== '-') {
            update({ distance: 1, minor: parseInt(minor) });
        }
    }), 750);
};

export {registerBeaconScanner, unregisterBeaconScanner};
