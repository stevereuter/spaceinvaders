/* eslint-disable import/extensions */
import { main } from "./dom.mjs";
import { getLives, getScore, sprite } from "./player.mjs";
import { getEnemies } from "./enemyManager.mjs";
import { enemyShots, playerShots } from "./spriteManager.mjs";

// #region contexts
/** @type {CanvasRenderingContext2D} */
const gameCtx = main.getContext("2d");
// #endregion
const canvasWidth = 600;
const canvasHeight = 600;
let spritesheet;

/**
 * @description sets the spritesheet image
 * @param {Image} image image
 */
export function setSpriteSheet(image) {
    spritesheet = image;
}

/**
 * @description clears the main game canvas
 */
export function clear() {
    gameCtx.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * @description displays message in UI canvas
 * @param {string[]} text test to display
 * @param {number} fontSize font size
 */
export function message(text, fontSize = 50) {
    gameCtx.font = `${fontSize}px serif`;
    gameCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
    gameCtx.fillRect(0, 0, 600, 600);
    const height = text.length === 1 ? 300 : 250;
    text.forEach((line, index) => {
        const { width } = gameCtx.measureText(line);
        // background to cover sprites
        gameCtx.fillStyle = "white";
        gameCtx.fillText(line, 300 - width / 2, height + index * fontSize);
    });
}

/**
 * @description draws the player ship
 * @param {number} x x
 * @param {number} y y
 * @param {number} width width
 * @param {number} height height
 */
function drawShip(x, y, width, height) {
    gameCtx.drawImage(spritesheet, 0, 50, 50, 50, x, y, width, height);
}

/**
 * @description draws a player ship
 */
function drawPlayerShip() {
    drawShip(sprite.getLeft(), sprite.getTop(), sprite.width, sprite.height);
}

/**
 * @description for drawing a single enemy
 * @param {import("./Sprite.mjs").SpriteInstance} enemySprite enemy sprite
 * @param {number} loopTime loop time
 * @returns {void}
 */
function drawEnemy(enemySprite, loopTime) {
    const frame = Math.round(loopTime % 500);
    gameCtx.drawImage(
        spritesheet,
        frame < 250 ? 0 : 50,
        0,
        50,
        50,
        enemySprite.getLeft(),
        enemySprite.getTop(),
        enemySprite.width,
        enemySprite.height,
    );
}

/**
 * @description draws an enemy
 * @param {number} loopTime loop time
 */
function drawEnemies(loopTime) {
    const enemies = getEnemies();
    if (!enemies.length) return;
    enemies.forEach((enemy) => {
        drawEnemy(enemy.sprite, loopTime);
    });
}

/**
 * @description draws the shots
 * @param {number} x x
 * @param {number} y y
 * @param {number} width width
 * @param {number} height height
 */
function drawShot(x, y, width, height) {
    gameCtx.fillStyle = "silver";
    gameCtx.beginPath();
    gameCtx.fillRect(x, y, width, height);
}
/**
 * @description updates player shots
 * @returns {void}
 */
function drawPlayerShots() {
    if (!playerShots.length) return;
    playerShots.forEach((shot) => {
        drawShot(shot.getLeft(), shot.getTop(), shot.width, shot.height);
    });
}

/**
 * @description updates player shots
 * @returns {void}
 */
function drawEnemyShots() {
    if (!enemyShots.length) return;
    enemyShots.forEach((shot) => {
        drawShot(shot.getLeft(), shot.getTop(), shot.width, shot.height);
    });
}

/**
 * @description draws the player stats, lives and score
 */
function drawPlayerStats() {
    const scoreText = `SCORE: ${getScore()}`;
    const livesText = "LIVES:";
    gameCtx.font = "20px serif";
    const livesWidth = gameCtx.measureText(livesText).width;
    const scoreWidth = gameCtx.measureText(scoreText).width;
    gameCtx.fillStyle = "silver";
    gameCtx.fillText(livesText, 15, 30);
    gameCtx.fillText(scoreText, 585 - scoreWidth, 30);
    const lives = getLives();
    if (!lives) return;
    for (let i = 1; i <= lives; i += 1) {
        drawShip(livesWidth - 5 + 30 * i, 15, 20, 20);
    }
}

/**
 * @description main draw function for game
 * @param {number} loopTime loop time
 */
export function draw(loopTime) {
    clear();
    drawPlayerShip();
    drawPlayerShots();
    drawEnemies(loopTime);
    drawEnemyShots();
    drawPlayerStats();
}
