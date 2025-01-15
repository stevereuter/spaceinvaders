/* eslint-disable import/extensions */

import Sprite from "./Sprite.mjs";
import { isFiring } from "./keyboard.mjs";
import { updateShip, sprite } from "./player.mjs";
import {
    updateEnemies,
    checkEnemyCollisions,
    enemies,
    getLowestEnemy,
} from "./enemyManager.mjs";
import { getEnemyFireRate, getEnemyShotsPerFire } from "./level.mjs";
import { StatType, add, getCurrentPlayTime } from "./state.mjs";

/** @typedef {import("./Sprite.mjs").SpriteInstance} SpriteInstance */

/** @type {SpriteInstance[]} */
export const playerShots = [];
const fireRate = 750;
let shotFired = 0;
const shotSpeed = 400;
/** @type {SpriteInstance[]} */
export const enemyShots = [];
let enemyShotFired = 0;
const enemyShotSpeed = 300;
/** @type {SpriteInstance[]} */
export const shields = [];

export function resetShots() {
    shotFired = 0;
    enemyShotFired = 0;
}

export function createShields() {
    // group x
    for (let g = 100; g < 500; g += 115) {
        // vertical
        for (let y = 445; y < 475; y += 10) {
            // horizontal
            for (let x = 0; x < 50; x += 10) {
                shields.push(new Sprite(g + x, y, 10, 10));
            }
        }
    }
}

/**
 * @description for removing all of the shots
 */
export function removeShots() {
    enemyShots.length = 0;
    playerShots.length = 0;
}

/**
 * @description get random enemy ids
 * @param {number} max max id
 * @param {number} qty number of ids
 * @param {number[]} ids ids
 * @returns {number[]} ids
 */
function getRandomEnemyIds(max, qty) {
    const ids = new Set();
    for (let i = 0; i < qty; i += 1) {
        const id = Math.floor(Math.random() * max);
        ids.add(id);
    }
    return ids;
}

function updateShields() {
    if (!shields.length) return;
    const lowestEnemy = getLowestEnemy();
    const lowEnemies = [];
    if (lowestEnemy > 445) {
        lowEnemies.push(...enemies.filter((e) => e.getBottom() >= lowestEnemy));
    }
    for (let i = shields.length - 1; i >= 0; i -= 1) {
        let hasHit = false;
        if (lowEnemies.length) {
            for (let e = 0; e < lowEnemies.length; e += 1) {
                hasHit = shields[i].hasCollision(lowEnemies[e]);
                if (hasHit) break;
            }
        }
        if (hasHit || shields[i].isHit()) {
            shields.splice(i, 1);
        }
    }
}

/**
 * @description updates enemy shots
 * @returns {void}
 */
function fireEnemyShots() {
    const playTime = getCurrentPlayTime();
    if (!enemyShotFired) enemyShotFired = playTime;
    if (enemyShotFired + getEnemyFireRate() > playTime) return;
    const enemyCount = enemies.length;
    // get random enemies
    const qty = Math.min(getEnemyShotsPerFire(), enemyCount);
    const ids = getRandomEnemyIds(enemyCount - 1, qty);
    const shotWidth = 5;
    ids.forEach((id) => {
        /** @type {SpriteInstance} */
        const enemySprite = enemies[id];
        enemyShots.push(
            new Sprite(
                enemySprite.getLeft() + (enemySprite.width - shotWidth) / 2,
                enemySprite.getBottom(),
                shotWidth,
                15
            )
        );
    });
    enemyShotFired = playTime;
}

/**
 * @description updates the enemy shots
 * @param {number} speedPercent loop speed percent
 */
function updateEnemyShots(speedPercent) {
    const shotCount = enemyShots.length;
    if (!shotCount) return;
    const speed = enemyShotSpeed * speedPercent;
    // loop backwards as wwe splice
    for (let i = shotCount - 1; i >= 0; i -= 1) {
        const { getLeft, getTop, isHit, hasCollision } = enemyShots[i];
        const outOfBounds = getTop() > 600;
        if (shields.length) {
            for (let s = 0; s < shields.length; s += 1) {
                const shield = shields[s];
                if (hasCollision(shield)) {
                    shield.hit();
                }
            }
        }
        const hasHit = isHit() || sprite.hasCollision(enemyShots[i]);
        enemyShots[i].update(
            getLeft(),
            getTop() + speed,
            hasHit || outOfBounds
        );

        if (isHit()) {
            enemyShots.splice(i, 1);
        }
    }
}

/**
 * @description for checking collision with enemy shots
 * @param {SpriteInstance} playerShot player shot
 * @returns {boolean} has collision
 */
function checkEnemyShotCollisions(playerShot) {
    if (!enemyShots.length) return;
    for (let i = 0; i < enemyShots.length; i += 1) {
        const shot = enemyShots[i];
        if (shot.hasCollision(playerShot)) {
            add(StatType.Score, 50);
            add(StatType.Hits);
            return true;
        }
    }
    return false;
}

/**
 * @description updates fired shots
 * @param {number} speedPercent loop speed percent
 */
function updateShots(speedPercent) {
    const shotLength = playerShots.length;
    if (!shotLength) return;
    const speed = shotSpeed * speedPercent;
    // update player shots, loop backwards as we splice
    for (let i = shotLength - 1; i >= 0; i -= 1) {
        const shot = playerShots[i];
        const outOfBounds = shot.getBottom() < 0;
        let hasHit = false;
        if (shields.length) {
            for (let s = 0; s < shields.length; s += 1) {
                hasHit = shot.hasCollision(shields[s]);
                if (hasHit) {
                    shields[s].hit();
                    add(StatType.Shields);
                    break;
                }
            }
        }
        if (!hasHit) {
            hasHit =
                checkEnemyCollisions(shot) || checkEnemyShotCollisions(shot);
        }
        shot.update(
            shot.getLeft(),
            shot.getTop() - speed,
            hasHit || outOfBounds
        );

        if (shot.isHit()) {
            playerShots.splice(i, 1);
        }
    }
}

/**
 * @description handle firing shots
 */
function fireHander() {
    const playTime = getCurrentPlayTime();
    if (!isFiring() || shotFired + fireRate >= playTime) return;
    // spawn shot
    shotFired = playTime;
    add(StatType.Shots);
    const shotWidth = 5;
    const shot = new Sprite(
        sprite.getLeft() + (sprite.width - shotWidth) / 2,
        sprite.getTop(),
        shotWidth,
        15
    );
    playerShots.push(shot);
}
/**
 * @description main update for sprites
 * @param {number} loopSpeed loop speed percent
 */
export function update(loopSpeed) {
    updateShip(loopSpeed);
    updateEnemies(loopSpeed);
    updateShots(loopSpeed);
    fireHander();
    fireEnemyShots();
    updateEnemyShots(loopSpeed);
    updateShields();
}
