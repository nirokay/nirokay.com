"use strict";
const directoryGameResources = "../resources/images/games/pingpong/";
let debugPrint = false;
function debug(msg, element = null) {
    if (!debugPrint) {
        return;
    }
    console.log(msg);
    if (element != null) {
        console.log(element);
    }
}
// Html IDs:
// =========
class Ball {
    constructor(picture) {
        this.pictureId = picture;
    }
}
class Cat {
    constructor(name, picture, score, highscore) {
        this.name = name;
        this.pictureId = picture;
        this.scoreId = score;
        this.highscoreId = highscore;
    }
    /**
     * Updates the source of the cat image element
     */
    setFrame(source) {
        let element = document.getElementById(this.pictureId);
        if (element == null) {
            console.error("Cat by id " + this.pictureId + " not found :(");
            return;
        }
        element.setAttribute("src", directoryGameResources + source);
    }
    /**
     * Sets the score of the cat
     */
    setScore(score) {
        let element = document.getElementById(this.scoreId);
        if (element == null) {
            console.error("Cat score by id " + this.scoreId + " not found");
            return;
        }
        element.innerHTML = score.toString();
    }
    /**
     * Increments the cat score
     */
    increaseScore() {
        let element = document.getElementById(this.scoreId);
        if (element == null) {
            console.error("Cat score by id " + this.scoreId + " not found");
            return;
        }
        this.setScore(parseInt(element.innerHTML) + 1);
        switch (this.name) {
            case "left":
                updateHighscore(1, 0);
                break;
            case "right":
                updateHighscore(0, 1);
                break;
            default:
                // This should never happen:
                console.error("Wtf kind of cat name is " + this.name);
        }
    }
    /**
     * Shifts the cat up
     */
    shiftUp() {
        let element = document.getElementById(this.pictureId);
        if (element == null) {
            console.error("Cat picture by id " + this.pictureId + " not found");
            return;
        }
        element.style.alignSelf = "baseline";
        setTimeout(() => {
            element.style.alignSelf = "end";
        }, config.pongs.msPongLength);
    }
}
let catLeft = new Cat("left", "id-cat-left-picture", "id-cat-left-score", "id-cat-left-highscore");
let catRight = new Cat("right", "id-cat-right-picture", "id-cat-right-score", "id-cat-right-highscore");
let ballLeft = new Ball("id-ball-left");
let ballRight = new Ball("id-ball-right");
let ballLeftGameOver = new Ball("id-ball-left-game-over");
let ballRightGameOver = new Ball("id-ball-right-game-over");
const idButtonStartGame = "id-button-start-game";
// Cat files:
// ==========
//  - Cat failures:
const directoryCatFailure = "cat/failure/";
const filesCatFailure = [
    "cry.gif",
    "disbelief.gif",
    "rage.gif",
    "sad.gif",
    "shock.gif"
];
//  - Cat successes:
const directoryCatSuccess = "cat/success/";
const filesCatSuccess = [
    "dance.gif",
    "grin.gif",
    "happy.gif",
    "smug.gif",
    "yippie.gif"
];
//  - Cat assets:
const directoryCatWhileGaming = "cat/";
const fileCatStandBy = "standby.png";
const fileCatPong = "pong.png";
//  - Ball assets:
const fileBall = "ball.png";
const fileBallEmpty = "ball_empty.png";
// Audio files:
// ============
const directorySounds = "../resources/sounds/games/pingpong/";
function newSound(filename) {
    return new Audio(directorySounds + filename);
}
const soundPingPong = newSound("pingpong.mp3");
const soundYippie = newSound("yippie.mp3");
const soundWinningMusic = newSound("winning-music.mp3");
soundWinningMusic.volume = 0.5;
// Cookie:
// =======
/**
 * Returns cookie in a index-value pair dictionary
 * @returns object Dictionary of key-value pairs
 */
function fetchCookie() {
    let result = {};
    let cookie = document.cookie;
    cookie.split(";").forEach((raw) => {
        let splitValues = raw.trim().split("=");
        let index = splitValues[0];
        if (splitValues.length < 2) {
            result[index] = null;
            return;
        }
        let value = splitValues[1];
        result[index] = value;
    });
    return result;
}
/**
 * Pushes the cookie into storage
 */
function sendCookie(dictionary) {
    var _a;
    //                           y    d     constant (full day)
    let expirationDays = 5 * 365 * (1000 * 60 * 60 * 24);
    let expirationDate = new Date().getTime() + expirationDays;
    for (const index in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, index)) {
            const value = (_a = dictionary[index]) !== null && _a !== void 0 ? _a : "";
            let newCookieValue = index + "=" + value + "; expires=" + expirationDate.toString() + "; ";
            document.cookie = newCookieValue;
        }
    }
}
// Highscore:
// ============
function updateHighscore(addLeft, addRight) {
    var _a;
    let cookie = fetchCookie();
    let highscoreLeft = 0;
    let highscoreRight = 0;
    // Get cookie score:
    let currentScores = ((_a = cookie["highscore"]) !== null && _a !== void 0 ? _a : "0:0").split(":");
    try {
        highscoreLeft = parseInt(currentScores[0]);
    }
    catch (error) {
        console.error(error);
    }
    try {
        highscoreRight = parseInt(currentScores[1]);
    }
    catch (error) {
        console.error(error);
    }
    // Update highscore:
    highscoreLeft += addLeft;
    highscoreRight += addRight;
    // Update Cookie:
    let newScore = highscoreLeft.toString() + ":" + highscoreRight.toString();
    cookie["highscore"] = newScore;
    sendCookie(cookie);
    // Update HTML:
    let htmlHighscoreLeft = document.getElementById(catLeft.highscoreId);
    if (htmlHighscoreLeft != null) {
        htmlHighscoreLeft.innerHTML = highscoreLeft.toString();
    }
    let htmlHighscoreRight = document.getElementById(catRight.highscoreId);
    if (htmlHighscoreRight != null) {
        htmlHighscoreRight.innerHTML = highscoreRight.toString();
    }
}
// Other constants:
// ================
const config = {
    pongs: {
        min: 2,
        multiplier: 10, // Range(0 .. 1) * multiplier
        msPongInterval: 1000,
        msPongLength: 200
    }
};
// Variables:
// ==========
let gameLock = false;
let frameCount = 0;
// Game logic stuff:
// =================
/**
 * This gets the next games pongs
 */
function getGamePongs() {
    let result = Math.ceil(Math.random() * config.pongs.multiplier + config.pongs.min);
    debug("Random pong: " + result.toString());
    return result;
}
/**
 * Sets all balls invisible except the one that is passed to it
 */
function moveBallTo(ball) {
    [ballLeft, ballRight, ballLeftGameOver, ballRightGameOver].forEach(ball => {
        let id = ball.pictureId;
        let picture = document.getElementById(id);
        if (picture == null) {
            console.error("Failed to find ball by id " + id);
            return;
        }
        picture.setAttribute("src", directoryGameResources + fileBallEmpty);
    });
    if (ball.pictureId == "null") {
        return;
    }
    let picture = document.getElementById(ball.pictureId);
    if (picture == null) {
        console.error("Failed to find ball by id " + ball.pictureId);
        return;
    }
    picture.setAttribute("src", directoryGameResources + fileBall);
}
/**
 * Updates the "Start Game" button text
 */
function setButtonText(text) {
    let button = document.getElementById(idButtonStartGame);
    if (button == null) {
        console.error("Button not found by id " + idButtonStartGame);
        return;
    }
    button.innerHTML = text;
}
/**
 * Inits cats as idle
 */
function setCatsIdle() {
    [catLeft, catRight].forEach(cat => {
        cat.setFrame(directoryCatWhileGaming + fileCatStandBy);
    });
}
/**
 * Gets a random index of an array
 */
function getRandomIndex(array) {
    let multiplier = Math.random();
    return Math.ceil(array.length * multiplier) - 1;
}
/**
 * Gets the currently winning cat (the one that pongs)
 */
function getWinningCat() {
    return frameCount % 2 == 0 ? catRight : catLeft;
}
/**
 * Gets the currently losing cat (the one that is about to pong)
 */
function getLosingCat() {
    return frameCount % 2 == 1 ? catRight : catLeft;
}
/**
 * Animates and updates cats and balls - increments `frameCount`
 */
function stepCatsPlayingPingPong(pongs) {
    let winningCat = getWinningCat();
    let losingCat = getLosingCat();
    soundPingPong.play();
    // Animate cats:
    losingCat.setFrame(directoryCatWhileGaming + fileCatStandBy);
    winningCat.setFrame(directoryCatWhileGaming + fileCatPong);
    winningCat.shiftUp();
    setTimeout(() => {
        winningCat.setFrame(directoryCatWhileGaming + fileCatStandBy);
    }, config.pongs.msPongLength);
    // Update frame counter:
    frameCount++;
    // Update ball:
    let ballPosition = winningCat.scoreId == catLeft.scoreId ? ballLeft : ballRight;
    if (frameCount < pongs) {
        // Normal ball update:
        moveBallTo(ballPosition);
    }
    else {
        // Game over ball position:
        setTimeout(() => {
            let finalBallPosition = ballPosition == ballLeft ? ballLeftGameOver : ballRightGameOver;
            moveBallTo(finalBallPosition);
        }, config.pongs.msPongLength);
    }
}
/**
 * Updates cats and score on game ending
 */
function endGame() {
    let winnerGif = directoryCatSuccess + filesCatSuccess[getRandomIndex(filesCatSuccess)];
    let loserGif = directoryCatFailure + filesCatFailure[getRandomIndex(filesCatFailure)];
    getWinningCat().setFrame(winnerGif);
    getLosingCat().setFrame(loserGif);
    soundYippie.play();
    getWinningCat().increaseScore();
    setTimeout(() => {
        soundWinningMusic.play();
        setButtonText("Another round!");
        gameLock = false;
    }, 1000);
}
/**
 * Game logic function (called by the "Start Game" button)
 */
function game() {
    // Ignore when game is in action:
    if (gameLock) {
        return;
    }
    // Lock for game and reset resources:
    gameLock = true;
    setButtonText("Waiting for results...");
    // Stop winning music:
    soundWinningMusic.pause();
    soundWinningMusic.currentTime = 0;
    // Init game:
    setCatsIdle();
    frameCount = 0;
    let pongs = getGamePongs();
    // Animate:
    let delay = config.pongs.msPongInterval;
    for (let i = 0; i < pongs; i++) {
        setTimeout(stepCatsPlayingPingPong, delay, pongs);
        delay += config.pongs.msPongInterval;
    }
    setTimeout(endGame, delay + config.pongs.msPongInterval);
}
window.onload = () => {
    moveBallTo(new Ball("null")); // Inits sources for the balls
    setCatsIdle(); // Inits sources for the cats
    setButtonText("Begin the battle!"); // Overrides the button text to before-first-game state
    updateHighscore(0, 0); // Display highscore
};
