import { getDirection } from "./keyboard.mjs";
import Sprite from "./Sprite.mjs";
import { get, minus, StatType } from "./state.mjs";

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
    shipHeight
);

export function resetShip() {
    sprite.update(
        canvasWidth / 2 - shipCenterWidth,
        canvasHeight - shipHeight * 2,
        false
    );
}

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
