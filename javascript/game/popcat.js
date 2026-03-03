"use strict";
const popcatCanvasWidth = 400;
const popcatCanvasHeight = 700;
const idGameVersion = "id-game-version";
const popcatGameVersion = "0.9.0";
const popcatResources = "../resources/images/games/popcat/";
const popcatResourcesSounds = "../resources/sounds/games/popcat/";
const popcatFallingInitSpeedCONST = 2;
let popcatFallingInitSpeed = popcatFallingInitSpeedCONST; // this will increase over the span of the game
const popcatFallingMultSpeed = 0.5;
const popcatFallingSpeedIncreaseInterval = 15;
const popcatFallingSpeedIncrease = 1.05;
const popcatEatingLine = popcatCanvasHeight - 60;
const popcatNotFoodHitboxGrace = 10;
const livesCONST = 3;
let lives = livesCONST;
let score = 0;
let highscore = 0;
let popcatGameRunning = false;
let popcatGameRestarted = false;
let popcatGameWasAlreadyStarted = false;
// Images:
function newPopcatImg(path) {
    let result = new Image();
    result.src = popcatResources + path;
    return result;
}
let popcatCatIdle = newPopcatImg("cat/idle.png");
let popcatCatNomp = newPopcatImg("cat/nomp.png");
let foodImages = [
    newPopcatImg("food/fish_blue.png"),
    newPopcatImg("food/fish_blue_flushed.png"),
    newPopcatImg("food/fish_red.png"),
    newPopcatImg("food/fish_red_flushed.png"),
];
let notFoodImages = [
    newPopcatImg("notfood/bomb.png"),
    newPopcatImg("notfood/cig.png"),
    newPopcatImg("notfood/car_red.png"),
    newPopcatImg("notfood/car_blue.png"),
    newPopcatImg("notfood/car_gray.png"),
    newPopcatImg("notfood/atomic_bomb.png"),
];
// Sounds:
function newPopCatSfx(path) {
    return new Audio(popcatResourcesSounds + path);
}
let popcatSfxPop = newPopCatSfx("pop.ogg");
let popcatSfxDeath = newPopCatSfx("death.ogg");
let popcatSfxDistress = newPopCatSfx("distress.ogg");
let popcatSfxEat = newPopCatSfx("eat.ogg");
function playSound(sound) {
    // Clone audio and play clone, so it can be played more than once at a time
    let audio = new Audio(sound.src);
    audio.play();
}
// Items:
class FallingItem {
    constructor() {
        this.height = popcatCanvasHeight * 2;
        this.sideways = popcatCanvasWidth / 2;
        this.speed = popcatFallingInitSpeed;
        this.image = newPopcatImg("no_img.png");
        this.isFood = true;
    }
}
let popcatFallingFood = [];
let popcatFallingNotFood = [];
function getRandomHeightOffset() {
    return Math.random() * popcatCanvasHeight * 2 + 200;
}
function getRandomSpeedOffset() {
    return Math.random() * popcatFallingMultSpeed + 1;
}
function getRandomIndexValue(list) {
    let index = Math.ceil(Math.random() * (list.length - 1)) - 1;
    return list[index];
}
function getRandomFallingItem(isFood) {
    let result = new FallingItem();
    result.height = -getRandomHeightOffset();
    result.speed *= getRandomSpeedOffset();
    result.isFood = isFood;
    let image;
    if (isFood) {
        image = getRandomIndexValue(foodImages);
    }
    else {
        image = getRandomIndexValue(notFoodImages);
    }
    result.sideways = popcatCanvasWidth / 2 - image.width / 2; // maybe in the future there will be a horizontal offset
    result.image = image;
    return result;
}
function getRandomFallingFood() {
    return getRandomFallingItem(true);
}
function getRandomFallingNotFood() {
    return getRandomFallingItem(false);
}
// Score and Lives:
function updateScore() {
    score++;
    playSound(popcatSfxEat);
    if (score > highscore)
        highscore = score;
    if (score % popcatFallingSpeedIncreaseInterval == 0) {
        popcatFallingInitSpeed *= popcatFallingSpeedIncrease;
        popcatFallingFood.push(getRandomFallingFood());
        popcatFallingNotFood.push(getRandomFallingNotFood());
    }
}
function updateLives() {
    lives--;
    if (lives > 0)
        playSound(popcatSfxDistress);
    else
        playSound(popcatSfxDeath);
}
// Init:
function popcatGameHasRestarted() {
    // Restart game and init objects:
    popcatGameRunning = true;
    popcatGameRestarted = true;
    // Reset speed:
    popcatFallingInitSpeed = popcatFallingInitSpeedCONST;
    // Reset lives and score:
    lives = livesCONST;
    score = 0;
    // Init objects:
    popcatFallingFood = [
        getRandomFallingFood(),
        getRandomFallingFood(),
        getRandomFallingFood(),
        getRandomFallingFood(),
    ];
    popcatFallingNotFood = [
        getRandomFallingNotFood(),
        getRandomFallingNotFood(),
    ];
}
// Main:
function popcatGame() {
    // Canvas:
    let canvas = document.getElementById("canvas");
    if (canvas == null) {
        alert("Canvas not found.");
        return;
    }
    let context = canvas.getContext("2d");
    if (context == null) {
        alert("Canvas rendering fucked up, idk...");
        return;
    }
    // Variables:
    let catMouthOpenLastFrame = false;
    let catMouthOpen = false;
    // Events:
    // * Open mouth:
    canvas.addEventListener("mousedown", (e) => {
        catMouthOpen = true;
    });
    canvas.addEventListener("touchstart", (e) => {
        catMouthOpen = true;
    });
    // * Close mouth:
    canvas.addEventListener("mouseup", (e) => {
        catMouthOpen = false;
    });
    canvas.addEventListener("touchend", (e) => {
        catMouthOpen = false;
    });
    canvas.addEventListener("mouseout", (e) => {
        catMouthOpen = false;
    });
    canvas.addEventListener("touchcancel", (e) => {
        catMouthOpen = false;
    });
    function updateItem(index, isFood) {
        function getNewItem() {
            return isFood ? getRandomFallingFood() : getRandomFallingNotFood();
        }
        function isInEatingRange() {
            let grace = isFood ? 0 : popcatNotFoodHitboxGrace;
            return (item.height <= popcatEatingLine - grace &&
                item.height + item.image.height >= popcatEatingLine + grace);
        }
        let item = isFood
            ? popcatFallingFood[index]
            : popcatFallingNotFood[index];
        // Fall:
        item.height += item.speed;
        // Respawn if reached the bottom:
        if (item.height > popcatCanvasHeight + 100)
            item = getNewItem();
        // Eating logic:
        if (catMouthOpen && isInEatingRange()) {
            isFood ? updateScore() : updateLives();
            item = getNewItem();
        }
        // Update array with item:
        isFood
            ? (popcatFallingFood[index] = item)
            : (popcatFallingNotFood[index] = item);
    }
    // Game logic:
    function init() {
        popcatGameHasRestarted();
    }
    function update() {
        if (context == null) {
            alert("Context unavailable in loop.");
            return;
        }
        // Init game if has been (re-)started:
        if (popcatGameRestarted) {
            init();
            popcatGameRestarted = false;
        }
        // Play pop sound (here because it should be able to be played when not in game):
        if (catMouthOpen && !catMouthOpenLastFrame) {
            playSound(popcatSfxPop);
        }
        catMouthOpenLastFrame = catMouthOpen;
        // Quit game if no lives:
        if (lives <= 0)
            popcatGameRunning = false;
        // Quit loop, if game is not running:
        if (!popcatGameRunning)
            return;
        popcatGameWasAlreadyStarted = true;
        // Let items fall:
        // Respawn items and check if eaten:
        for (let i = 0; i < popcatFallingFood.length; i++) {
            updateItem(i, true);
        }
        for (let i = 0; i < popcatFallingNotFood.length; i++) {
            updateItem(i, false);
        }
        // Section only if mouth is open (in eating mode):
    }
    function render() {
        if (context == null) {
            alert("Context unavailable in loop.");
            return;
        }
        // Background:
        context.clearRect(0, 0, popcatCanvasWidth, popcatCanvasHeight);
        // Cat:
        let catImage = catMouthOpen
            ? popcatCatNomp
            : popcatCatIdle;
        context.drawImage(catImage, popcatCanvasWidth / 2 - catImage.width / 2, popcatCanvasHeight - catImage.height - 10);
        [...popcatFallingFood, ...popcatFallingNotFood].forEach((item) => {
            context.drawImage(item.image, item.sideways, item.height);
        });
        // Draw text:
        let fontSpacing = 2;
        let upperFontLine = 40;
        context.font = "20px sans-serif";
        context.fillStyle = "#e8e6e3";
        // * Highscore:
        context.textBaseline = "bottom";
        context.textAlign = "end";
        context.fillText(highscore.toString() + " 🏆", popcatCanvasWidth - fontSpacing, upperFontLine - fontSpacing);
        // * Score:
        context.textBaseline = "top";
        context.fillText(score.toString() + " 🐟", popcatCanvasWidth - fontSpacing, upperFontLine + fontSpacing);
        // * Lives:
        context.textAlign = "start";
        context.textBaseline = "bottom";
        context.fillText("❤️ " + lives + " / " + livesCONST, fontSpacing, upperFontLine - fontSpacing);
        if (!popcatGameRunning) {
            let text = popcatGameWasAlreadyStarted
                ? "Game over"
                : "Press the button above to start";
            context.font = "25px sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(text, popcatCanvasWidth / 2, popcatCanvasHeight / 2);
        }
        // Draw eating line (debug):
        context.beginPath();
        context.moveTo(0, popcatEatingLine);
        context.lineTo(popcatCanvasWidth, popcatEatingLine);
        context.stroke();
    }
    function main() {
        update();
        render();
        setTimeout(main, 10);
    }
    main();
}
function setGameVersion() {
    let element = document.getElementById(idGameVersion);
    if (element == null)
        return;
    element.innerHTML = "v" + popcatGameVersion;
}
window.onload = () => {
    popcatGame();
    setGameVersion();
};
