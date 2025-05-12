import { keyDownHandler, keyUpHandler } from "./keyboard.mjs";

// #region elements
// eslint-disable-next-line import/prefer-default-export
export const main = document.querySelector("#game-layer");
// #endregion

// #region events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
// #endregion
