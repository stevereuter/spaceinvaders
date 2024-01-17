/* eslint-disable import/extensions */

import Sprite from "./Sprite.mjs";
import { isFiring } from "./keyboard.mjs";
import { updateShip, sprite } from "./player.mjs";
import {
    updateEnemies,
    checkEnemyCollision,
    getEnemies,
} from "./enemyManager.mjs";
import { getEnemyFireRate, getEnemyShotsPerFire } from "./level.mjs";

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

/**
 * @description updates enemy shots
 * @param {number} loopTime loop timestamp
 * @returns {void}
 */
function fireEnemyShots(loopTime) {
    if (!enemyShotFired) enemyShotFired = loopTime;
    if (enemyShotFired + getEnemyFireRate() > loopTime) return;
    const enemyCount = getEnemies().length;
    // get random enemies
    const qty = Math.min(getEnemyShotsPerFire(), enemyCount);
    const ids = getRandomEnemyIds(enemyCount - 1, qty);
    const shotWidth = 5;
    ids.forEach((id) => {
        /** @type {SpriteInstance} */
        const enemySprite = getEnemies()[id];
        enemyShots.push(
            new Sprite(
                enemySprite.getLeft() + (enemySprite.width - shotWidth) / 2,
                enemySprite.getBottom(),
                shotWidth,
                15
            )
        );
    });
    enemyShotFired = loopTime;
}

/**
 * @description updates the enemy shots
 * @param {number} loopTime loop timestamp
 * @param {number} speedPercent loop speed percent
 */
function updateEnemyShots(loopTime, speedPercent) {
    const shotCount = enemyShots.length;
    if (!shotCount) return;
    const speed = enemyShotSpeed * speedPercent;
    for (let i = shotCount - 1; i >= 0; i -= 1) {
        const { getLeft, getTop, getBottom, isHit } = enemyShots[i];
        enemyShots[i].update(
            getLeft(),
            getTop() + speed,
            sprite.hasCollision(enemyShots[i]) || getBottom() < 0
        );

        if (isHit()) {
            enemyShots.splice(i, 1);
        }
    }
}

/**
 * @description updates fired shots
 * @param {number} speedPercent loop speed percent
 */
function updateShots(speedPercent) {
    const shotLength = playerShots.length;
    if (!shotLength) return;
    const speed = shotSpeed * speedPercent;
    // update player shots
    for (let i = shotLength - 1; i >= 0; i -= 1) {
        const shot = playerShots[i];
        const hit = checkEnemyCollision(shot);
        shot.update(
            shot.getLeft(),
            shot.getTop() - speed,
            hit || shot.getBottom() < 0
        );

        if (shot.isHit()) {
            playerShots.splice(i, 1);
        }
    }
}

/**
 * @description handle firing shots
 * @param {number} loopTime loop timestamp
 */
function fireHander(loopTime) {
    if (isFiring() && shotFired + fireRate < loopTime) {
        // spawn shot
        shotFired = loopTime;
        const shotWidth = 5;
        const shot = new Sprite(
            sprite.getLeft() + (sprite.width - shotWidth) / 2,
            sprite.getTop(),
            shotWidth,
            15
        );
        playerShots.push(shot);
    }
}
/**
 * @description main update for sprites
 * @param {number} loopSpeed loop speed percent
 * @param {number} loopTime loop timestamp
 */
export function update(loopSpeed, loopTime) {
    updateShip(loopSpeed);
    updateEnemies(loopSpeed);
    updateShots(loopSpeed);
    fireHander(loopTime);
    fireEnemyShots(loopTime);
    updateEnemyShots(loopTime, loopSpeed);
}
