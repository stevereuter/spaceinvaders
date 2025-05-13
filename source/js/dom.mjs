import { Key, keyDownHandler, keyUpHandler } from "./keyboard.mjs";

const controlElements = {
    [Key.LEFT]: document.querySelector("#left"),
    [Key.RIGHT]: document.querySelector("#right"),
    [Key.FIRE]: document.querySelector("#fire"),
    [Key.PAUSE1]: document.querySelector("#pause"),
    [Key.QUIT]: document.querySelector("#quit"),
};

// #region elements
// eslint-disable-next-line import/prefer-default-export
export const main = document.querySelector("#game-layer");
// #endregion

// #region events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
Object.entries(controlElements).forEach(([key, element]) => {
    element.addEventListener("touchstart", () => {
        keyDownHandler({ key });
    });
    element.addEventListener("touchend", () => {
        keyUpHandler({ key });
    });
});
// #endregion
