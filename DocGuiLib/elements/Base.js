import ElementUtils from "../core/Element"

export default class BaseElement {
    constructor(x = 1, y = 1, w = 1, h = 1, toggle = false, colorScheme = null, elementType = null) {
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
        this.toggle = toggle
        this.colorScheme = colorScheme
        this.elementType = elementType

        // Event handlers
        this.onMouseClick = null
        this.onMouseEnter = null
        this.onMouseLeave = null
        this.onMouseDrag = null
        this.onMouseRelease = null
        this.onKeyType = null
    }

    /**
     * - Gets the current state color of the given element using default colors
     * @param {String} elementType 
     * @returns {JavaColor}
     */
    _getCurrentColor(elementType = "Toggle") {
        return this.toggle ? ElementUtils.getJavaColor(this.colorScheme[this.elementType ?? elementType].enabled) : ElementUtils.getJavaColor(this.colorScheme[this.elementType ?? elementType].disabled)
    }

    /**
     * - Gets this element's color scheme for the given colorObject
     * @param {String} colorObj 
     * @returns {JavaColor}
     */
    _getColor(colorObj) {
        return ElementUtils.getJavaColor(this.colorScheme[this.elementType][colorObj])
    }

    /**
     * - Gets the schemeObject from the color scheme
     * @param {String} schemeObj 
     * @returns {Number|String|Array}
     */
    _getSchemeValue(schemeObj) {
        return this.colorScheme[this.elementType][schemeObj]
    }

    /**
     * - Sets the current color scheme for this component
     * @param {Object} colorScheme The color scheme object
     * @returns this for method chaining
     */
    setColorScheme(colorScheme = {}) {
        this.colorScheme = colorScheme

        return this
    }

    /**
     * - Sets a color for this element into its default colors (not global only for this component)
     * @param {String} schemeObj The name of the color object in the default values to change
     * @param {[Number, Number, Number, Number]} colorArray [red, green, blue, alpha] from 0 to 255
     * @param {Object} colorScheme The color scheme to automatically be set as default for this component
     * @param {String|null} elementType The element type e.g "Toggle"
     * @returns this for method chaining
     */
    setSchemeValue(schemeObj = "enabled", value = [0, 0, 0, 0], colorScheme = null, elementType = "Toggle") {
        if (colorScheme) this.setColorScheme(colorScheme)

        this.colorScheme[this.elementType ?? elementType][schemeObj] = value

        return this
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
    onMouseReleaseEvent(fn, shouldCancel = false) {
        this.onMouseRelease = [ shouldCancel, fn ]

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