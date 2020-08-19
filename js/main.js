console.log('Main!');

import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { utilService } from './services/util.service.js';


var map;
var gLocTable = null;



window.onload = () => {
    initLocTable();
    initMap()
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
            map.addListener('click', onAddLocation)
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

function renderLocTable() {
    let locs = locService.loadLocs();
    let strHtml = `
        <tr>
            <th>Location</th>
            <th>Go To</th>
            <th>Delete</th>
        </tr>`;
    locs.forEach(loc => {
        strHtml += `
        <tr>
            <th>somewhere</th>
            <th><button class="btn" data-func="go" data-lat="${loc.lat}" data-lng="${loc.lng}"">Go</button></th>
            <th><button class="btn" data-func="delete" data-lat="${loc.lat}" data-lng="${loc.lng}">Delete</button></th>
        </tr>
        `
    })
    gLocTable.innerHTML = strHtml;
}

function onAddLocation(mapMouseEvent) {
    console.log(mapMouseEvent.latLng);
    let latLng = JSON.stringify(mapMouseEvent.latLng);
    latLng = JSON.parse(latLng);
    addMarker(latLng)
    map.panTo(latLng);
    locService.saveLoc(latLng);
    renderLocTable()
}

function initLocTable() {
    gLocTable = document.querySelector('table');
    gLocTable.addEventListener('click', (ev) => {
        let targetData = ev.target.dataset;
        if (!targetData.func) return; //If the clicked element does not have a function, return

        console.log('clicked a button!');
        if (targetData.func === 'go') panTo(targetData.lat, targetData.lng);
        else if (targetData.func === 'delete') {
            console.log('deleting...');
            renderLocTable();
        }
    })

    renderLocTable();
}