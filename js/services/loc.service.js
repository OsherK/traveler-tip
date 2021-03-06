export const locService = {
    getPosition,
    loadLocs,
    saveLoc,
    getLocName,
    removeLoc
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

function getLocName(latLng) {
    const API_KEY = 'AIzaSyC7sT1JSz3f0o62sFfmtGwlLGnp1w9YdJk';
    const res = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat}, ${latLng.lng}&key=${API_KEY}`)
    const prm = res.then(loc => {
        console.log(loc.data.results[0]);
        return loc.data.results[0];
    })
    return prm;
}

function removeLoc(id) {
    let locs = loadLocs()
    const locIdx = locs.findIndex(loc => loc.id === id);
    locs.splice(locIdx, 1);
    localStorage.setItem('locs', JSON.stringify(locs));
}

function loadLocs() {
    let locs = localStorage.getItem('locs')
    if (!locs) locs = []
    else locs = JSON.parse(localStorage.getItem('locs'))
    return locs
}

function saveLoc(latLng, name) {
    let locs = loadLocs();
    latLng.createdAt = new Date();
    latLng.id = makeId();
    latLng.name = name;
    locs.push(latLng);
    localStorage.setItem('locs', JSON.stringify(locs));
}

function makeId() {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    for (let i = 0; i < 10; i++) {
        id += chars.charAt(getRandomInteger(chars.length));
    }
    return id;
}



function getRandomInteger(max, min = 0) {
    return Math.floor((Math.random() * max - min) + min + 1);
}