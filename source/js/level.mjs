import { enemyShots, playerShots } from "./spriteManager.mjs";

let level = 1;

/**
 * @description for increasing the level
 */
export function increaseLevel() {
    level += 1;
}
/**
 * for resetting the level back to 1
 */
export function resetLevel() {
    level = 1;
}

export const getEnemyMaxSpeed = () => 400 + level * 50;
export const getEnemyFireRate = () => 3500 / level;
export const getEnemyShotsPerFire = () => level;
