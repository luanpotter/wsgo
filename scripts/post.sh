#!/bin/sh

curl -vX POST https://wsgo-beacons.appspot.com/api/settings -d @rooms.json -H "Content-Type: application/json"
