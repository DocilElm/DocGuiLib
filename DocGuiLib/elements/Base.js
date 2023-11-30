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

        // Event handlers
        this.onMouseClick = null
        this.onMouseEnter = null
        this.onMouseLeave = null
        this.onMouseDrag = null
        this.onKeyType = null
    }

    /**
     * - Sets the [x y] position for this element
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} isPercent Whether the position is percent or not
     * @returns this for method chaining
     */
    setPosition(x, y, isPercent = true) {
        this.x = isPercent
            ? (ElementUtils.percentToPixel(x, Renderer.screen.getWidth())).pixels()
            : (x).pixels()
        this.y = isPercent
            ? (ElementUtils.percentToPixel(y, Renderer.screen.getHeight())).pixels()
            : (y).pixels()

        this.cleanValues.x = this.x.value
        this.cleanValues.y = this.y.value

        return this
    }

    /**
     * - Force sets the position values to the given ones (dosent automatically assign them to percent or pixels)
     * @param {Number} x 
     * @param {Number} y 
     * @returns this for method chaining
     */
    _setPosition(x, y) {
        this.x = x
        this.y = y

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

        this.cleanValues.width = this.width.value
        this.cleanValues.height = this.height.value

        return this
    }

    /**
     * - Force sets the size values to the given ones (dosent automatically assign them to percent or pixels)
     * @param {Number} width 
     * @param {Number} height 
     * @returns this for method chaining
     */
    _setSize(width, height) {
        this.width = width
        this.height = height

        return this
    }

    /**
     * - Adds a function to be ran whenever this event is triggered
     * @param {Boolean} shouldCancel Whether it should cancel this component's custom event handler or not
     * @param {Function} fn The function to be ran whenever this is triggered
     * @returns this for method chaining
     */
    onMouseClickEvent(fn, shouldCancel = false) {
        this.onMouseClick = [ shouldCancel, fn ]

        return this
    }

    /**
     * - Adds a function to be ran whenever this event is triggered
     * @param {Boolean} shouldCancel Whether it should cancel this component's custom event handler or not
     * @param {Function} fn The function to be ran whenever this is triggered
     * @returns this for method chaining
     */
    onMouseEnterEvent(fn, shouldCancel = false) {
        this.onMouseEnter = [ shouldCancel, fn ]

        return this
    }

    /**
     * - Adds a function to be ran whenever this event is triggered
     * @param {Boolean} shouldCancel Whether it should cancel this component's custom event handler or not
     * @param {Function} fn The function to be ran whenever this is triggered
     * @returns this for method chaining
     */
    onMouseLeaveEvent(fn, shouldCancel = false) {
        this.onMouseLeave = [ shouldCancel, fn ]

        return this
    }

    /**
     * - Adds a function to be ran whenever this event is triggered
     * @param {Boolean} shouldCancel Whether it should cancel this component's custom event handler or not
     * @param {Function} fn The function to be ran whenever this is triggered
     * @returns this for method chaining
     */
    onMouseDragEvent(fn, shouldCancel = false) {
        this.onMouseDrag = [ shouldCancel, fn ]

        return this
    }

    /**
     * - Adds a function to be ran whenever this event is triggered
     * @param {Boolean} shouldCancel Whether it should cancel this component's custom event handler or not
     * @param {Function} fn The function to be ran whenever this is triggered
     * @returns this for method chaining
     */
    onKeyTypeEvent(fn, shouldCancel = false) {
        this.onKeyType = [ shouldCancel, fn ]

        return this
    }

    /**
     * - Triggers the event handler for the given handler
     * @param {[Boolean, Function]} handler The handler to trigger from (e.g this.onMouseClick)
     * @param  {...any} args The arguments to trigger the handler function with
     * @returns {null|Number}
     */
    _triggerEvent(handler, ...args) {
        // If no handler is given we return [null]
        if (!handler) return null

        // Trigger the event handler (the function) set by the user
        handler[1](...args)

        // If [shouldCancel] is enabled we [return 1] so the custom event handler dosen't get triggered
        if (handler[0]) return 1
    }
}