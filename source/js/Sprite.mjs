/**
 * @typedef SpriteInstance
 * @property {(x:number, y:number) => number[]} getCoordinates get coordinates
 * @property {(newX:number, newY:number, newHit:boolean) => void} update updates properties
 * @property {() => number} getTop getTop
 * @property {() => number[]} getTopLeft getTopLeft
 * @property {() => number[]} getTopRight getTopRight
 * @property {() => number} getBottom getBottom
 * @property {() => number[]} getBottomLeft getBottomLeft
 * @property {() => number[]} getBottomRight getBottomRight
 * @property {() => number} getLeft getLeft
 * @property {() => number} getRight getRight
 * @property {() => boolean} isHit isHit
 * @property {number} width width
 * @property {number} height height
 */

/**
 * @description creates a sprite object
 * @param {number} startX starting x
 * @param {number} startY starting y
 * @param {number} width width
 * @param {number} height height
 * @returns {SpriteInstance} sprite instance
 */
export default function Sprite(startX, startY, width, height) {
    let x = startX;
    let y = startY;
    let hit = false;

    return {
        width,
        height,
        // #region methods
        getCoordinates: () => [x, y],
        /**
         * @description updates coordinates
         * @param {number} newX x coordinate
         * @param {number} newY y coordinate
         * @param {boolean} newHit new hit value
         */
        update: (newX, newY, newHit = false) => {
            x = newX;
            y = newY;
            hit = newHit;
        },
        getTop: () => y,
        getTopLeft: () => [x, y],
        getTopRight: () => [x + width, y],
        getBottom: () => y + height,
        getBottomLeft: () => [x, y + height],
        getBottomRight: () => [x + width, y + height],
        getLeft: () => x,
        getRight: () => x + width,
        isHit: () => hit,
        hit: () => {
            hit = true;
        },
        // #endregion
    };
}
