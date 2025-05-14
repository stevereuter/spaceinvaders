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
// keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
// touch events for mobile
Object.entries(controlElements).forEach(([key, element]) => {
    element.addEventListener("touchstart", (e) => {
        keyDownHandler({ ...e, key });
    });
    element.addEventListener("touchend", (e) => {
        keyUpHandler({ ...e, key });
    });
});
// #endregion
