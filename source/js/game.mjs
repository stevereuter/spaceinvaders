/* eslint-disable import/extensions */
import { clear, draw, message, setSpriteSheet } from "./draw.mjs";
import { isFiring, isPausing, isQuiting } from "./keyboard.mjs";
import {
    getLives,
    getScore,
    resetScore,
    setLives,
    setPointBooster,
} from "./player.mjs";
import { enemies, createEnemySwarm } from "./enemyManager.mjs";
import { createShields, removeShots, update } from "./spriteManager.mjs";
import { increaseLevel, resetLevel } from "./level.mjs";

/** @enum {number} */
const GameState = {
    Paused: 0,
    Running: 1,
    Ended: 2,
    Exit: 3,
};

let gameClock;
let currentState = GameState.Paused;
let startingLives = 0;
let startingPointBooster = 0;
let id;

/**
 * @description get the speed percent to be applied in the current loop
 * @param {number} loopTime loop timestamp
 * @param {number} gameTime game timestamp
 * @returns {number} percent of speed
 */
function getSpeedPercent(loopTime, gameTime) {
    const difference = loopTime - gameTime;
    return difference / 1000;
}

/**
 * @description get image
 * @returns {Promise<Image>} image
 */
function loadImageAsync() {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = "source/images/space_invaders_sprites.png";
        image.onload = () => resolve(image);
    });
}

/**
 * @description resumes a game with new lives
 * @param {number} lives number of lives
 * @param {number} pointBooser point booster
 * @param {boolean} resetScoreToZero reset score back to zero
 */
function resume(lives, pointBooser, resetScoreToZero = true) {
    clear();
    message(
        [
            "ARROWS TO MOVE",
            "SHIFT TO FIRE",
            "P TO PAUSE",
            "---",
            "FIRE TO START",
        ],
        35
    );
    startingLives = lives;
    startingPointBooster = pointBooser;
    setPointBooster(pointBooser);
    setLives(lives);
    createEnemySwarm();
    createShields();
    currentState = GameState.Paused;
    if (!resetScoreToZero) return;
    resetScore();
}

/**
 * @description main game loop
 */
function loop() {
    const loopTime = Date.now();
    const loopSpeed = getSpeedPercent(loopTime, gameClock);

    if (currentState !== GameState.Running && isQuiting()) {
        currentState = GameState.Exit;
    }

    if (currentState === GameState.Running && !enemies.length) {
        removeShots();
        increaseLevel();
        createEnemySwarm();
        createShields();
    }

    if (currentState === GameState.Paused && isFiring()) {
        currentState = GameState.Running;
    }
    if (currentState === GameState.Running && isPausing()) {
        currentState = GameState.Paused;
        message(["PAUSED"]);
    }
    if (currentState === GameState.Running && !getLives()) {
        currentState = GameState.Ended;
        message(["GAME OVER", `SCORE: ${getScore()}`, "PRESS Q TO QUIT"]);
    }

    // update when running
    if (currentState === GameState.Running) {
        update(loopSpeed, loopTime);
        draw(loopTime);
    }

    if (currentState === GameState.Exit) {
        removeShots();
        resetLevel();
        resume(startingLives, startingPointBooster);
    }

    // end
    gameClock = loopTime;
    window.requestAnimationFrame(loop);
}

/**
 * @description starts a new game
 * @param {string} scoreId id
 * @param {number} lives number of lives
 * @param {number} pointBooster point booster multiplyer
 */
export async function start(scoreId, lives = 3, pointBooster = 1.0) {
    id = scoreId;
    startingLives = lives;
    gameClock = Date.now();
    removeShots();
    resetLevel();
    resetScore();
    resume(lives, pointBooster);
    const spritesheet = await loadImageAsync();
    setSpriteSheet(spritesheet);
    loop();
}
