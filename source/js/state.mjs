import { resetBonusEnemy } from "./enemyManager.mjs";
import { setHighScore } from "./highScore.mjs";
import { resetShip } from "./player.mjs";
import { resetShots } from "./spriteManager.mjs";

export const StatType = {
    Lives: "lives",
    Score: "score",
    Boost: "pointBooster",
    Shots: "shotsFired",
    Enemies: "enemiesHit",
    Bonuses: "bonusesHit",
    Missed: "bonusesMissed",
    Shields: "shieldsHit",
    Level: "level",
    Hits: "shotsHit",
};

const stats = {
    lives: 0,
    score: 0,
    pointBooster: 1,
    shotsFired: 0,
    enemiesHit: 0,
    bonusesHit: 0,
    bonusesMissed: 0,
    shieldsHit: 0,
    shotsHit: 0,
    playTimeMap: new Map(),
    currentPlayTimeKey: 0,
    level: 1,
};

export function reset(lives = 0, pointBooser = 1, score = 0, level = 1) {
    stats.lives = lives;
    stats.score = score;
    stats.pointBooster = pointBooser;
    stats.shotsFired = 0;
    stats.enemiesHit = 0;
    stats.bonusesHit = 0;
    stats.bonusesMissed = 0;
    stats.shieldsHit = 0;
    stats.playTimeMap.clear();
    stats.currentPlayTimeKey = 0;
    stats.level = level;
    stats.shotsHit = 0;
    resetShots();
    resetBonusEnemy();
    resetShip();
}

export function get(type) {
    if (typeof stats[type] === "undefined") {
        throw new Error(`Stat property ${type} does not exist`);
    }
    const getTypes = [StatType.Score, StatType.Lives, StatType.Level];
    if (!getTypes.includes(type)) {
        throw new Error(`${type} is not an addable stat`);
    }
    return stats[type];
}

export function add(type, value) {
    if (typeof stats[type] === "undefined") {
        throw new Error(`Stat property ${type} does not exist`);
    }
    const addableStats = [
        StatType.Enemies,
        StatType.Bonuses,
        StatType.Missed,
        StatType.Shields,
        StatType.Shots,
        StatType.Score,
        StatType.Level,
        StatType.Hits,
    ];
    if (!addableStats.includes(type)) {
        throw new Error(`${type} is not an addable stat`);
    }
    stats[type] += value || 1;
    if (type !== StatType.Score) {
        return;
    }
    setHighScore(stats.score);
}

export function minus(type, value) {
    if (typeof stats[type] === "undefined") {
        throw new Error(`Stat property ${type} does not exist`);
    }
    if (type !== StatType.Lives) {
        throw new Error(`${type} is not an addable stat`);
    }
    stats[type] -= value || 1;
}

export function run(time) {
    stats.currentPlayTimeKey = time;
    stats.playTimeMap.set(time, null);
}

function getDisplayTextByType(type) {
    switch (type) {
        case StatType.Score:
            return "Score";
        case StatType.Bonuses:
            return "Bonus ships destroyed";
        case StatType.Enemies:
            return "Invaders destroyed";
        case StatType.Hits:
            return "Invader shots hit";
        case StatType.Level:
            return "Level";
        case StatType.Shots:
            return "Shots fired";
        case StatType.Shields:
            return "Shields destroyed";
    }
    return type;
}

function padMiddle(start, end, total, char) {
    const padding = total - end.length;
    return `${start.padEnd(padding, char)}${end}`;
}

export const getCurrentPlayTime = () =>
    [...stats.playTimeMap.entries()]
        .map(([start, end]) => (end ? end : Date.now()) - start)
        .reduce((total, amount) => total + amount, 0);

export function getStats() {
    const message = [];
    Object.entries(stats).forEach(([key, value]) => {
        const displayText = getDisplayTextByType(key);
        if (key === displayText) return;
        message.push(
            padMiddle(getDisplayTextByType(key), value.toString(), 30, " ")
        );
    });
    const playTime = getCurrentPlayTime() / 1000;
    message.push(padMiddle("Time played", playTime.toString(), 30, " "));
    return message;
}

export function stop(time) {
    stats.playTimeMap.set(stats.currentPlayTimeKey, time);
}
