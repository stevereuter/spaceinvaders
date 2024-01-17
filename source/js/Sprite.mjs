/**
 * @typedef SpriteInstance
 * @property {(newX:number, newY:number, newHit:boolean) => void} update updates properties
 * @property {() => number} getTop getTop
 * @property {() => number} getBottom getBottom
 * @property {() => number} getLeft getLeft
 * @property {() => number} getRight getRight
 * @property {() => boolean} isHit isHit
 * @property {() => boolean} hasCollision hasCollision
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
    let hasHit = false;

    // #region methods
    /**
     * @description updates coordinates
     * @param {number} newX x coordinate
     * @param {number} newY y coordinate
     * @param {boolean} newHit new hit value
     */
    function update(newX, newY, newHit = false) {
        x = newX;
        y = newY;
        hasHit = newHit;
    }
    const getTop = () => y;
    const getBottom = () => y + height;
    const getLeft = () => x;
    const getRight = () => x + width;
    const isHit = () => hasHit;
    const hit = () => {
        hasHit = true;
    };
    /**
     * @description check it there is a collision with sprite
     * @param {SpriteInstance} sprite sprite to test
     * @returns {boolean} has collision
     */
    function hasCollision(sprite) {
        if (sprite.getBottom() < getTop()) return false;
        if (sprite.getTop() > getBottom()) return false;
        if (sprite.getLeft() > getRight()) return false;
        if (sprite.getRight() < getLeft()) return false;
        hasHit = true;
        return true;
    }
    // #endregion

    return {
        width,
        height,
        update,
        getTop,
        getBottom,
        getLeft,
        getRight,
        isHit,
        hit,
        hasCollision,
    };
}
