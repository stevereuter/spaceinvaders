/* eslint-disable import/extensions */
import { getDirection } from "./keyboard.mjs";
import Sprite from "./Sprite.mjs";

const shipHeight = 50;
const shipWidth = 50;
const shipCenterWidth = shipWidth / 2;
const canvasWidth = 600;
const canvasHeight = 600;
/** @type {import("./Sprite.mjs").SpriteInstance} */
export const sprite = new Sprite(
    canvasWidth / 2 - shipCenterWidth,
    canvasHeight - shipHeight * 2,
    shipWidth,
    shipHeight,
);

let lives = 0;
let score = 0;
let pointBooster = 1;

/**
 * @description sets the life count
 * @param {number} value life count
 */
export function setLives(value) {
    lives = value;
}
/**
 * @description for restting the score
 */
export function resetScore() {
    score = 0;
}
/**
 * @description for adding to the score
 * @param {number} value score to add
 */
export function addScore(value) {
    score += value * pointBooster;
}
/**
 * @description for setting the point booster
 * @param {number} value multiplier percent
 */
export function setPointBooster(value) {
    pointBooster = value;
}

export const getLives = () => lives;
export const getScore = () => score;
/**
 * @description get the top coordinates
 * @returns {number[]} top coordinates [x, y]
 */
export function getShipTopCenter() {
    return [sprite.getLeft() + shipCenterWidth, sprite.getTop()];
}
// ship top 500, height 50
const shipSpeed = 100;
/**
 * @description get if is at left end
 * @returns {boolean} at left end
 */
function isAtLeftEnd() {
    return sprite.getLeft() <= 0;
}
/**
 * @description get if is at right end
 * @returns {boolean} at right end
 */
function isAtRightEnd() {
    return sprite.getRight() >= canvasWidth;
}
/**
 * @description updates the player ship position
 * @param {number} speed speed
 * @returns {void}
 */
function updateShipPosition(speed) {
    const direction = getDirection();
    if (isAtLeftEnd() && direction < 0) return;
    if (isAtRightEnd() && direction > 0) return;
    const newX = sprite.getLeft() + speed * direction;
    const newY = sprite.getTop();
    if (sprite.isHit()) {
        lives -= 1;
    }
    sprite.update(newX, newY, lives < 1);
}
/**
 * @description updates the player ship
 * @param {number} loopSpeed loop speed percent
 * @returns {void}
 */
export function updateShip(loopSpeed) {
    const speed = shipSpeed * loopSpeed;
    updateShipPosition(speed);
}

/**
 * @description check if sprite passed in is colliding with the player
 * @param {import("./Sprite.mjs").SpriteInstance} sprite sprite
 * @returns {boolean} has collision
 */
export function checkPlayerCollision({ getLeft, getRight, getTop, getBottom }) {
    if (
        getLeft() > sprite.getLeft() &&
        getRight() < sprite.getRight() &&
        getTop() > sprite.getTop() &&
        getBottom() < sprite.getBottom()
    ) {
        sprite.hit();
        return true;
    }

    return false;
}
