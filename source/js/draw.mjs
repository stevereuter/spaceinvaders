import { main } from "./dom.mjs";
import { sprite } from "./player.mjs";
import { bonusEnemy, enemies } from "./enemyManager.mjs";
import { enemyShots, playerShots, shields } from "./spriteManager.mjs";
import { StatType, get } from "./state.mjs";
import { getHighScore } from "./highScore.mjs";

// #region contexts
/** @type {CanvasRenderingContext2D} */
const gameCtx = main.getContext("2d");
// #endregion
/** @type {number} */
let canvasWidth;
/** @type {number} */
let canvasHeight;
/** @type {HTMLImageElement} */
let spritesheet;

/**
 * @description for setting the canvas size
 * @param {number} width
 * @param {number} height
 */
export function setCanvasSize(width = 600, height = 600) {
    canvasWidth = width;
    canvasHeight = height;
}

/**
 * @description sets the spritesheet image
 * @param {HTMLImageElement} image image
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
    gameCtx.font = `${fontSize}px monospace`;
    gameCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    gameCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    const height = 100;
    for (let index = 0; index < text.length; index += 1) {
        const line = text[index];
        const { width } = gameCtx.measureText(line);
        // background to cover sprites
        gameCtx.fillStyle = "white";
        gameCtx.fillText(line, 300 - width / 2, height + index * fontSize);
    }
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
 * @description gets the animation frame
 * @param {number} loopTime loop time
 * @param {number} animationLength total animation duration time
 * @param {number} frameCount number of animation frames
 * @param {boolean} reverseAtEnd reverse the frames at the end of the animation
 * @returns {number} animation frame, spritesheet y position base 50
 */
function getAnimationFrame(
    loopTime,
    animationLength,
    frameCount,
    reverseAtEnd = false
) {
    const timeStamp = Math.round(loopTime % animationLength);
    const totalFrameCount = reverseAtEnd
        ? frameCount + (frameCount - 2)
        : frameCount;
    for (let frame = 0; frame < totalFrameCount; frame += 1) {
        const iteration = frame + 1;
        const frameDuration = (animationLength / totalFrameCount) * iteration;
        if (timeStamp < frameDuration) {
            const offset =
                iteration > frameCount ? frameCount - 1 - iteration : 0;
            return (frame + offset) * 50;
        }
    }
    return 0;
}

/**
 * @description for drawing a single enemy
 * @param {import("./Sprite.mjs").SpriteInstance} enemySprite enemy sprite
 * @param {number} loopTime loop time
 * @returns {void}
 */
function drawEnemy(enemySprite, loopTime) {
    const frame = getAnimationFrame(loopTime, 500, 2);
    gameCtx.drawImage(
        spritesheet,
        frame,
        enemySprite.spritesheetY,
        50,
        50,
        enemySprite.getLeft(),
        enemySprite.getTop(),
        enemySprite.width,
        enemySprite.height
    );
}

/**
 * @description for drawing the bonus enemy
 * @param {import("./Sprite.mjs").SpriteInstance} sprite sprite
 * @param {number} loopTime loop time
 */
function drawBonusEnemy(sprite, loopTime) {
    const frame = getAnimationFrame(loopTime, 400, 4, true);
    gameCtx.drawImage(
        spritesheet,
        frame,
        100,
        50,
        50,
        sprite.getLeft(),
        sprite.getTop(),
        sprite.width,
        sprite.height
    );
}

/**
 * @description draws an enemy
 * @param {number} loopTime loop time
 */
function drawEnemies(loopTime) {
    const enemyLength = enemies.length;
    if (!enemyLength) return;
    for (let i = 0; i < enemyLength; i += 1) {
        drawEnemy(enemies[i], loopTime);
    }
    if (!bonusEnemy) return;
    drawBonusEnemy(bonusEnemy, loopTime);
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
    const shotLength = playerShots.length;
    if (!shotLength) return;
    for (let i = 0; i < shotLength; i += 1) {
        const shot = playerShots[i];
        drawShot(shot.getLeft(), shot.getTop(), shot.width, shot.height);
    }
}

/**
 * @description updates player shots
 * @returns {void}
 */
function drawEnemyShots() {
    const shotLength = enemyShots.length;
    if (!shotLength) return;
    for (let i = 0; i < shotLength; i += 1) {
        const shot = enemyShots[i];
        drawShot(shot.getLeft(), shot.getTop(), shot.width, shot.height);
    }
}

function drawText(text, x, y) {
    gameCtx.font = "20px serif";
    gameCtx.fillStyle = "silver";
    gameCtx.fillText(text, x, y);
}

function drawPlayerScore() {
    const scoreText = `SCORE: ${get(StatType.Score)}`;
    const scoreWidth = gameCtx.measureText(scoreText).width;
    drawText(scoreText, 585 - scoreWidth, 30);
}

function drawPlayerLives() {
    const livesText = "LIVES:";
    const livesWidth = gameCtx.measureText(livesText).width;
    drawText(livesText, 15, 30);
    const lives = get(StatType.Lives);
    if (!lives) return;
    for (let i = 1; i <= lives; i += 1) {
        drawShip(livesWidth - 5 + 30 * i, 15, 20, 20);
    }
}

function drawHighScore() {
    const highScoreText = `HI: ${getHighScore()}`;
    const highScoreWidth = gameCtx.measureText(highScoreText).width;
    drawText(highScoreText, 300 - highScoreWidth / 2, 30);
}

function drawShields() {
    if (!shields.length) return;
    for (let i = 0; i < shields.length; i += 1) {
        const shield = shields[i];
        drawShot(
            shield.getLeft(),
            shield.getTop(),
            shield.width,
            shield.height
        );
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
    drawPlayerScore();
    drawPlayerLives();
    drawHighScore();
    drawShields();
}
