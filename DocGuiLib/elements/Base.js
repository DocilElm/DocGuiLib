import ElementUtils from "../core/Element"

export default class BaseElement {
    constructor(x = 1, y = 1, w = 1, h = 1) {
        this.x = (x).percent()
        this.y = (y).percent()
        this.width = (w).percent()
        this.height = (h).percent()

        this.cleanValues = {
            x: x,
            y: y,
            width: w,
            height: h
        }
    }

    /**
     * - Sets the [x y] position for this element
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} isPercent Wheather the position is percent or not
     * @returns this for method chaining
     */
    setPosition(x, y, isPercent = true) {
        this.x = isPercent
            ? (ElementUtils.percentToPixel(x, Renderer.screen.getWidth())).pixels()
            : (x).pixels()
        this.y = isPercent
            ? (ElementUtils.percentToPixel(y, Renderer.screen.getHeight())).pixels()
            : (y).pixels()

        this.cleanValues.x = x
        this.cleanValues.y = y

        return this
    }

    /**
     * Sets the [width, height] for this element
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} isPercent 
     * @returns this for method chaining
     */
    setSize(width, height, isPercent = true) {
        this.width = isPercent
            ? (ElementUtils.percentToPixel(width, Renderer.screen.getWidth())).pixels()
            : (width).pixels()
        this.height = isPercent
            ? (ElementUtils.percentToPixel(height, Renderer.screen.getHeight())).pixels()
            : (height).pixels()

        this.cleanValues.width = width
        this.cleanValues.height = height

        return this
    }
}