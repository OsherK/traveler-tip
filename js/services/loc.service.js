export const locService = {
    getPosition,
    loadLocs,
    saveLoc
}


function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function loadLocs() {
    let locs = localStorage.getItem('locs');
    if (!locs) locs = [];
    else locs = JSON.parse(localStorage.getItem('locs'));
    return locs;
}

function saveLoc(latLng) {
    let locs = loadLocs();
    locs.push(latLng);
    localStorage.setItem('locs', JSON.stringify(locs));
}