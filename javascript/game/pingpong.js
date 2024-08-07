"use strict";
// Html IDs:
// =========
class Cat {
    constructor(picture, score) {
        this.pictureId = picture;
        this.scoreId = score;
    }
}
let catLeft = new Cat("id-cat-left", "id-cat-left-score");
let catRight = new Cat("id-cat-right", "id-cat-right-score");
// Cat files:
// ==========
//  - Cat failures:
const directoryCatFailure = "cat/failure/";
const filesCatFailure = [
    "sad-01.gif",
    "disbelief.gif"
];
//  - Cat successes:
const directoryCatSuccess = "cat/success/";
const filesCatSuccess = [
    "yippie.gif"
];
//  - Cat assets:
const directoryCatWhileGaming = "cat/";
const fileCatStandBy = "cat-standby.png";
const fileCatPong = "cat-pinged.png";
// Other constants:
// ================
const config = {
    pongs: {
        min: 3,
        multiplier: 10 // Range(0 .. 1) * multiplier -> pongs
    }
};
// Variables:
// ==========
let gameLock = false;
/**
 * This gets the next games pongs
 */
function getGamePongs() {
    return Math.random() * config.pongs.multiplier + config.pongs.min;
}
function setCatPicture(id, source) {
    let element = document.getElementById(id);
    if (element == null) {
        console.error("Cat by id " + id + " not found :(");
        return;
    }
    element.setAttribute("src", source);
}
function setCatsIdle() {
    [catLeft.pictureId, catRight.pictureId].forEach(id => {
        setCatPicture(id, directoryCatWhileGaming + fileCatStandBy);
    });
}
function game() {
    if (gameLock) {
        return;
    }
    gameLock = true;
    // Init game:
    let pongs = getGamePongs();
    // Release lock:
    gameLock = false;
}
