/* eslint-disable import/extensions */
import Sprite from "./Sprite.mjs";
import { Direction } from "./keyboard.mjs";
import { getEnemyMaxSpeed } from "./level.mjs";
import { addScore } from "./player.mjs";

const enemies = [];
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
    enemies.length = 0;
    const size = 30;
    const gap = 20;
    for (let x = gap; x <= 350; x += size + gap) {
        for (let y = gap * 2; y < 250; y += size + gap) {
            enemies.push(new Sprite(x, y, 40, 40));
        }
    }
    setEnemySpeed();
}

/**
 * @description gets enemy array
 * @returns {import("./Sprite.mjs").SpriteInstance[]} enemies
 */
export function getEnemies() {
    return enemies;
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
function getLowestEnemy() {
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
    if (direction === Direction.Right && getMaxEnemyRight() > 575) {
        direction = Direction.Left;
        speedY += 15;
    }
    if (direction === Direction.Left && getMinEnemyLeft() < 25) {
        direction = Direction.Right;
        speedY += 15;
    }
    if (elevation === Direction.Down && getLowestEnemy() > 475) {
        elevation = Direction.Up;
    }
    if (elevation === Direction.Up && getHighestEnemy() < 100) {
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
            addScore(100);
        }
    }
}

/**
 * @description updates the enemies
 * @param {number} loopSpeed loop percent
 */
export function updateEnemies(loopSpeed) {
    const speedX = enemySpeed * loopSpeed;
    updateEnemySwarm(speedX);
}

/**
 * @description checks for player shot collision with an enemy
 * @param {import("./Sprite.mjs").SpriteInstance} shot shot sprite
 * a little crude, can be optimized by checking if the shot is within the total box of enemies first
 * @returns {boolean} is collision
 */
export function checkEnemyCollision(shot) {
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
