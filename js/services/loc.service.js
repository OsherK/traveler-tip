export const locService = {
    getPosition,
    loadLocs,
    saveLoc,
}

function getPosition(searchTerm = null) {
    if (!searchTerm) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    }
    const API_KEY = 'AIzaSyC7sT1JSz3f0o62sFfmtGwlLGnp1w9YdJk'
    const res = axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: searchTerm,
            key: API_KEY,
        },
    })
    const prmData = res.then((loc) => {
        const city = loc.data.results[0].address_components[0].long_name
        const fullAddress = loc.data.results[0].formatted_address
        const coords = loc.data.results[0].geometry.location
        return { city, fullAddress, coords }
    })

    return prmData
}

function loadLocs() {
    let locs = localStorage.getItem('locs')
    if (!locs) locs = []
    else locs = JSON.parse(localStorage.getItem('locs'))
    return locs
}

function saveLoc(latLng) {
    let locs = loadLocs()
    latLng.createdAt = new Date()
    latLng.id = makeId();
    locs.push(latLng)
    localStorage.setItem('locs', JSON.stringify(locs))
}

function makeId() {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    for (let i = 0; i < 10; i++) {
        id += chars.charAt(getRandomInteger(chars.length));
    }
    return id;
}



function getRandomInteger(max, min = 0) {
    return Math.floor((Math.random() * max - min) + min + 1);
}