import { StatType, get } from "./state.mjs";

export const getEnemyMaxSpeed = () => 200 + get(StatType.Level) * 50;
export const getEnemyFireRate = () => 3500 / get(StatType.Level);
export const getEnemyShotsPerFire = () => get(StatType.Level);
