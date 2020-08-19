export const utilService = {
    makeId,
    getRandomInteger
}

var markers = null;

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