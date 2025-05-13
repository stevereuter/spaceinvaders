import { getDirection } from "./keyboard.mjs";
import Sprite from "./Sprite.mjs";
import { get, minus, StatType } from "./state.mjs";

/** @type {number} */
let shipHeight;
/** @type {number} */
let shipWidth;
/** @type {number} */
let width;
/** @type {number} */
let height;
/** @type {import("./Sprite.mjs").SpriteInstance} */
export let sprite;

/**
 * @description for creating the ship based on the canvas size
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
export function createShip(canvasWidth = 600, canvasHeight = 600) {
    width = canvasWidth;
    height = canvasHeight;
    shipWidth = width / 12;
    shipHeight = canvasHeight / 12;

    sprite = new Sprite(
        width / 2 - shipWidth / 2,
        height - shipHeight * 2,
        shipWidth,
        shipHeight
    );
}

export function resetShip() {
    sprite.update(width / 2 - shipWidth / 2, height - shipHeight * 2, false);
}

/**
 * @description get the top coordinates
 * @returns {number[]} top coordinates [x, y]
 */
export function getShipTopCenter() {
    return [sprite.getLeft() + shipWidth / 2, sprite.getTop()];
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
    return sprite.getRight() >= width;
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
        minus(StatType.Lives, 1);
    }
    sprite.update(newX, newY, get(StatType.Lives) < 1);
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
