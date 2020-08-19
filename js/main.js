console.log('Main!');

import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';


var map;



window.onload = () => {
    initMap()
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(x => console.log('INIT MAP ERROR', x));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
}

document.querySelector('.btn-go').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo(35.6895, 139.6917);
})

document.querySelector('.btn-my-loc').addEventListener('click', (ev) => {
    console.log('Panning to user\'s location');
    let userPos;
    locService.getPosition()
        .then(pos => {
            userPos = pos.coords;
            console.log(userPos);
            panTo(userPos.latitude, userPos.longitude);
        })


})


function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return mapService.connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            map.addListener('click', mapMouseEvent => {
                let latLng = mapMouseEvent.latLng
                map.panTo(latLng);
                locService.saveLoc(latLng);
                renderLocs()
            })
            console.log('Map!', map);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

function renderLocs() {
    let locs = locService.loadLocs();
    console.log(locs);
}