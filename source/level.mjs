import { enemyShots, playerShots } from "./spriteManager.mjs";

let level = 1;

/**
 * @description for increasing the level
 */
export function increaseLevel() {
    level += 1;
    removeShots();
}
/**
 * for resetting the level back to 1
 */
export function resetLevel() {
    level = 1;
    removeShots();
}

/**
 * 
 * remove any shots on level movement
 */
function removeShots(){
    enemyShots.splice(0, enemyShots.length);
    playerShots.splice(0, playerShots.length);
}

export const getEnemyMaxSpeed = () => 400 + level * 50;
export const getEnemyFireRate = () => 3500 / level;
export const getEnemyShotsPerFire = () => level;
