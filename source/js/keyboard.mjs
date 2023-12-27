const keys = new Set();
/** enum {string} */
const Key = {
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    FIRE: "Shift",
    PAUSE1: "p",
    PAUSE2: "P",
    QUIT: "q",
};
/** @enum {number} Direction */
export const Direction = {
    Right: 1,
    Left: -1,
    Stopped: 0,
    Up: -1,
    Down: 1,
};

/**
 * @description handles key down event
 * @param {Event} event key down event
 */
export function keyDownHandler({ key }) {
    keys.add(key);
}
/**
 * @description handles key up event
 * @param {Event} event key up event
 */
export function keyUpHandler({ key }) {
    keys.delete(key);
}
/**
 * @description get direction multiplier
 * @returns {Direction} direction multiplier
 */
export function getDirection() {
    if (keys.has(Key.LEFT) && keys.has(Key.RIGHT)) return Direction.Stopped;
    if (keys.has(Key.LEFT)) return Direction.Left;
    if (keys.has(Key.RIGHT)) return Direction.Right;
    return Direction.Stopped;
}
/**
 * @description get if firing
 * @returns {boolean} is firing
 */
export function isFiring() {
    return keys.has(Key.FIRE);
}
/**
 * @description gets is pausing
 * @returns {boolean} is pausing
 */
export function isPausing() {
    return keys.has(Key.PAUSE1) || keys.has(Key.PAUSE2);
}
/**
 * @description gets is quiting
 * @returns {boolean} is quiting
 */
export function isQuiting() {
    return keys.has(Key.QUIT);
}
