/* eslint-disable import/extensions */
import Sprite from "./Sprite.mjs";
import { Direction } from "./keyboard.mjs";
import { getEnemyMaxSpeed } from "./level.mjs";
import { StatType, add } from "./state.mjs";
/** @typedef {import("./Sprite.mjs").SpriteInstance} SpriteInstance */

const Bounds = {
    Top: 100,
    Right: 575,
    Bottom: 475,
    Left: 25,
};
/** @type {SpriteInstance[]} */
export const enemies = [];
/** @type {SpriteInstance} */
export let bonusEnemy;
let bonusEnemyTime;
let bonusEnemyDirection;
let direction = Direction.Right;
let elevation = Direction.Down;
let enemySpeed = 0;

/**
 * @description for setting the enemy speed
 */
function setEnemySpeed() {
    const count = enemies.length;
    if (count === 1) {
        enemySpeed = getEnemyMaxSpeed() * 2;
        return;
    }
    enemySpeed = Math.max(30, getEnemyMaxSpeed() - count * 10);
}

// create enemies on level,
// can create more complex patterns by adding empty spots to the array
/**
 * @description creates all enemies for level
 */
export function createEnemySwarm() {
    const spriteReference = new Map([
        [60, 200],
        [110, 150],
        [160, 0],
        [210, 0],
    ]);
    enemies.length = 0;
    const size = 30;
    const gap = 20;
    for (let x = gap; x <= 350; x += size + gap) {
        for (let y = gap * 3; y < 250; y += size + gap) {
            enemies.push(new Sprite(x, y, 40, 40, spriteReference.get(y)));
        }
    }
    setEnemySpeed();
}

/**
 * @description gets the highest enemy x value
 * @returns {number} max x
 */
function getMaxEnemyRight() {
    return Math.max(
        ...enemies.map((sprite) => sprite.getLeft() + sprite.width)
    );
}

/**
 * @description gets the lowest enemy x
 * @returns {number} min x
 */
function getMinEnemyLeft() {
    return Math.min(...enemies.map((sprite) => sprite.getLeft()));
}

/**
 * @description gets the lowest enemy on screen
 * @returns {number} min y
 */
export function getLowestEnemy() {
    return Math.max(...enemies.map((sprite) => sprite.getBottom()));
}

/**
 * @description gets the lowest enemy on screen
 * @returns {number} min y
 */
function getHighestEnemy() {
    return Math.min(...enemies.map((sprite) => sprite.getTop()));
}

/**
 * @description updates the enemies
 * @param {number} speedX speed of swarm x
 */
function updateEnemySwarm(speedX) {
    let speedY = 0;
    if (direction === Direction.Right && getMaxEnemyRight() > Bounds.Right) {
        direction = Direction.Left;
        speedY += 15;
    }
    if (direction === Direction.Left && getMinEnemyLeft() < Bounds.Left) {
        direction = Direction.Right;
        speedY += 15;
    }
    if (elevation === Direction.Down && getLowestEnemy() > Bounds.Bottom) {
        elevation = Direction.Up;
    }
    if (elevation === Direction.Up && getHighestEnemy() < Bounds.Top) {
        elevation = Direction.Down;
    }
    const distanceX = speedX * direction;
    const startIndex = enemies.length - 1;
    // loop backwards as we are slicing enemies
    for (let i = startIndex; i >= 0; i -= 1) {
        const { getLeft, getTop, isHit, update } = enemies[i];
        update(getLeft() + distanceX, getTop() + speedY * elevation, isHit());
        if (isHit()) {
            enemies.splice(i, 1);
            setEnemySpeed();
            add(StatType.Score, 100);
            add(StatType.Enemies);
        }
    }
}

/**
 * @description for updating the bonus enemy
 * @param {number} speedX speed x
 * @param {number} loopTime loop time
 */
function updateBonusEnemy(speedX, loopTime) {
    if (!bonusEnemyTime) {
        bonusEnemyTime = loopTime;
        return;
    }
    const timeElapsed = loopTime - bonusEnemyTime;
    if (timeElapsed < 10000) return;
    if (!bonusEnemy) {
        bonusEnemyDirection =
            Math.random() > 0.5 ? Direction.Left : Direction.Right;
        bonusEnemy = new Sprite(
            bonusEnemyDirection === Direction.Right ? -50 : 600,
            25,
            50,
            50
        );
    }
    const outOfBounds =
        (bonusEnemyDirection === Direction.Left && bonusEnemy.getRight() < 0) ||
        (bonusEnemyDirection === Direction.Right && bonusEnemy.getLeft() > 600);
    bonusEnemy.update(
        bonusEnemy.getLeft() + speedX * bonusEnemyDirection,
        bonusEnemy.getTop(),
        bonusEnemy.isHit() || outOfBounds
    );
    if (!bonusEnemy.isHit()) return;
    if (outOfBounds) {
        add(StatType.Missed);
    } else {
        add(StatType.Score, 500);
        add(StatType.Bonuses);
    }
    bonusEnemy = null;
    bonusEnemyTime = loopTime;
}

/**
 * @description updates the enemies
 * @param {number} loopSpeed loop percent
 * @param {number} loopTime loop time
 */
export function updateEnemies(loopSpeed, loopTime) {
    const speedX = enemySpeed * loopSpeed;
    updateEnemySwarm(speedX);
    const bonusSpeed = (getEnemyMaxSpeed() / 2) * loopSpeed;
    updateBonusEnemy(bonusSpeed, loopTime);
}

/**
 * @description checks for player shot collision with an enemy
 * @param {SpriteInstance} shot shot sprite
 * a little crude, can be optimized by checking if the shot is within the total box of enemies first
 * @returns {boolean} is collision
 */
export function checkEnemyCollisions(shot) {
    if (bonusEnemy && bonusEnemy.hasCollision(shot)) return true;
    // avoid loop if possible
    if (getLowestEnemy() < shot.getTop()) return false;
    if (getHighestEnemy() > shot.getBottom()) return false;
    if (getMinEnemyLeft() > shot.getRight()) return false;
    if (getMaxEnemyRight() < shot.getLeft()) return false;
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].hasCollision(shot)) {
            return true;
        }
    }
    return false;
}
