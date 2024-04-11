/* eslint-disable import/extensions */
import { clear, draw, message, setSpriteSheet } from "./draw.mjs";
import { isFiring, isPausing, isQuiting } from "./keyboard.mjs";
import { enemies, createEnemySwarm } from "./enemyManager.mjs";
import { createShields, removeShots, update } from "./spriteManager.mjs";
import { StatType, add, get, reset, run, stop } from "./state.mjs";

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
 */
function resume(lives, pointBooser) {
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
    reset(lives, pointBooser);
    createEnemySwarm();
    createShields();
    removeShots();
    currentState = GameState.Paused;
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
        add(StatType.Level);
        createEnemySwarm();
        createShields();
    }

    if (currentState === GameState.Paused && isFiring()) {
        run(loopTime);
        currentState = GameState.Running;
    }
    if (currentState === GameState.Running && isPausing()) {
        stop(loopTime);
        currentState = GameState.Paused;
        message(["PAUSED"]);
    }
    if (currentState === GameState.Running && !get(StatType.Lives)) {
        stop(loopTime);
        currentState = GameState.Ended;
        message([
            "GAME OVER",
            `SCORE: ${get(StatType.Score)}`,
            "PRESS Q TO QUIT",
        ]);
    }

    // update when running
    if (currentState === GameState.Running) {
        update(loopSpeed, loopTime);
        draw(loopTime);
    }

    if (currentState === GameState.Exit) {
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
    startingPointBooster = pointBooster;
    gameClock = Date.now();
    resume(lives, pointBooster);
    const spritesheet = await loadImageAsync();
    setSpriteSheet(spritesheet);
    loop();
}
