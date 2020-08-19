console.log('Main!')

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'

var map
var gLocTable = null

window.onload = () => {
    initLocTable()
    initMap()
        .then(res => {
            renderMarkers();
            locService.getLocName({ lat: 32.0749831, lng: 34.9120554 })
                .then(name => {
                    weatherService.getWeather({ lat: 32.0749831, lng: 34.9120554 }, name.address_components[2].long_name)
                        .then(renderWeather)
                })

        })
        .catch((x) => console.log('INIT MAP ERROR', x))
    locService
        .getPosition()
        .then((pos) => {
            console.log('User position is:', pos.coords)
        })
        .catch((err) => {
            console.log('Cannot get user-position', err)
        })
}

document.querySelector('.btn-go').addEventListener('click', (ev) => {
    const searchTerm = document.querySelector('.search-loc').value
    locService.getPosition(searchTerm).then((location) => {
        initMap(location.coords.lat, location.coords.lng)
        onAddLocation(location.coords);
    })
})

document.querySelector('.btn-my-loc').addEventListener('click', () => {
    console.log("Panning to user's location")
    let userPos
    locService.getPosition().then((pos) => {
        userPos = pos.coords
        console.log(userPos)
        panTo(userPos.latitude, userPos.longitude)
    })
})

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return mapService.connectGoogleApi().then(() => {
        console.log('google available')
        map = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        })
        map.addListener('click', (event) => {
            onAddLocation(event.latLng)
        })
        console.log('Map!', map)
    })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'address',
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    map.panTo(laLatLng);
}

function renderLocTable() {
    let locs = locService.loadLocs()
    let strHtml = `
        <tr>
            <th>Location</th>
            <th>Go To</th>
            <th>Delete</th>
        </tr>`
    locs.forEach((loc) => {
        strHtml += `
        <tr>
            <th>${loc.name}</th>
            <th><button class="btn" data-func="go" data-lat="${loc.lat}" data-lng="${loc.lng}"">Go</button></th>
            <th><button class="btn" data-func="delete" data-id="${loc.id}">Delete</button></th>
        </tr>
        `
    })
    gLocTable.innerHTML = strHtml
}

function onAddLocation(latLng) {
    console.log(latLng);
    latLng = JSON.stringify(latLng)
    latLng = JSON.parse(latLng);
    locService.getLocName(latLng).then(name => {
        weatherService.getWeather(latLng, name.address_components[2].long_name)
            .then(renderWeather)
        locService.saveLoc(latLng, name.formatted_address);
        map.panTo(latLng)
        renderLocTable()
        renderMarkers()
    })
}

function initLocTable() {
    gLocTable = document.querySelector('table')
    gLocTable.addEventListener('click', (ev) => {
        let targetData = ev.target.dataset
        if (!targetData.func) return //If the clicked element does not have a function, return

        console.log('clicked a button!')
        if (targetData.func === 'go') {
            panTo(targetData.lat, targetData.lng)
            locService.getLocName({ lat: targetData.lat, lng: targetData.lng }).then(name => {
                weatherService.getWeather(targetData, name.address_components[2].long_name)
                    .then(renderWeather)
            })
        } else if (targetData.func === 'delete') {
            onDelete(targetData.id);
        }
    })

    renderLocTable()
}

function onDelete(id) {
    locService.removeLoc(id);
    renderLocTable();
    initMap()
        .then(renderMarkers)
}

function renderMarkers() {
    let locs = locService.loadLocs()
    locs.forEach((loc) => {
        addMarker({ lat: loc.lat, lng: loc.lng })
    })
}

function renderWeather(weatherData) {
    const {
        locationName,
        desc,
        icon,
        currentTemp,
        mainWeather,
        maxTemp,
        minTemp,
        wind,
    } = weatherData
    const strHTML = `
        <img src="img/${icon}.png"></img>
        <h2>${locationName}, ${currentTemp} ${mainWeather}</h2>
        <h3 class="text-secondary weather-desc">${desc}</h3>
        <strong>From: ${minTemp} to ${maxTemp}</strong>
        <p>Wind Speed: ${wind}</p>
    `
    document.querySelector('.weather').innerHTML = strHTML
}