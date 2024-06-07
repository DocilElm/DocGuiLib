import ElementUtils from "../core/Element"

export default class BaseElement {
    constructor(x = 1, y = 1, width = 1, height = 1, value, colorScheme = null, elementType = null, outline = false) {
        this.x = (x).percent()
        this.y = (y).percent()
        this.width = (width).percent()
        this.height = (height).percent()

        this.cleanValues = {
            x: x,
            y: y,
            width: width,
            height: height
        }
        this.value = value
        this.string = null
        this.colorScheme = colorScheme
        this.elementType = elementType
        this.outline = outline

        // Default colorScheme in case the user does not add one
        this.defaultColorScheme = JSON.parse(FileLib.read("DocGuiLib", "data/DefaultColors.json"))

        // Event handlers
        this.onMouseClick = null
        this.onMouseEnter = null
        this.onMouseLeave = null
        this.onMouseDrag = null
        this.onMouseRelease = null
        this.onKeyType = null
    }

    /**
     * - Sets the [value] variable for this component
     * @param {Any} value 
     * @returns this for method chaining
     */
    setValue(value) {
        this.value = value

        return this
    }

    /**
     * - Sets the [string] variable for this component
     * @param {String} string 
     * @returns this for method
     */
    setString(string) {
        this.string = string

        return this
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
     * @param {Boolean} isPercent Whether it should be percent values or not (true by default)
     * @param {Boolean} useCustomPercent Whether to use a custom percent system or the built in elementa one (false by default)
     * @returns this for method chaining
     */
    setPosition(x, y, isPercent = true, useCustomPercent = false) {
        if (isPercent && !useCustomPercent) {
            this.x = (x).percent()
            this.y = (y).percent()

            this._setCleanValues(x, y)

            return this
        }
        else if (isPercent && useCustomPercent) {
            this.x = (ElementUtils.percentToPixel(x, Renderer.screen.getWidth())).pixels()
            this.y = (ElementUtils.percentToPixel(y, Renderer.screen.getHeight())).pixels()

            this._setCleanValues(x, y)

            return this
        }

        this.x = (x).pixels()
        this.y = (y).pixels()

        this._setCleanValues(x, y)

        return this
    }

    /**
     * Sets the [width, height] for this element
     * @param {Number} width 
     * @param {Number} height 
     * @param {Boolean} isPercent Whether it should be percent values or not (true by default)
     * @param {Boolean} useCustomPercent Whether to use a custom percent system or the built in elementa one (false by default)
     * @returns this for method chaining
     */
    setSize(width, height, isPercent = true, useCustomPercent = false) {
        if (isPercent && !useCustomPercent) {
            this.width = (width).percent()
            this.height = (height).percent()

            this._setCleanValues(null, null, width, height)

            return this
        }
        else if (isPercent && useCustomPercent) {
            this.width = (ElementUtils.percentToPixel(width, Renderer.screen.getWidth())).pixels()
            this.height = (ElementUtils.percentToPixel(height, Renderer.screen.getHeight())).pixels()

            this._setCleanValues(null, null, width, height)

            return this
        }

        this.width = (width).pixels()
        this.height = (height).pixels()

        this._setCleanValues(null, null, width, height)

        return this
    }

    /**
     * - Gets the current toggle state [true/false] if this component uses it
     * @returns {Boolean|null}
     */
    getToggle() {
        if (!(this.value instanceof Boolean)) return null

        return this.value
    }

    /**
     * - Gets the [value] variable for this component
     * @returns {Any}
     */
    getValue() {
        return this.value
    }

    /**
     * - Gets the [string] variable for this component
     * @returns {String}
     */
    getString() {
        return this.string
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
     * - Sets the clean values for these variables
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @returns this for method chaining
     */
    _setCleanValues(x = null, y = null, width = null, height = null) {
        this.cleanValues.x = x ?? this.cleanValues.x
        this.cleanValues.y = y ?? this.cleanValues.y
        this.cleanValues.width = width ?? this.cleanValues.width
        this.cleanValues.height = height ?? this.cleanValues.height

        return this
    }

    /**
     * - Gets the current state color of the given element using default colors
     * @param {String} elementType 
     * @returns {JavaColor}
     */
    _getCurrentColor(elementType = "Toggle") {
        const scheme = this.colorScheme?.[this.elementType ?? elementType]?.enabled ? this.colorScheme : this.defaultColorScheme

        return this.value ? ElementUtils.getJavaColor(scheme[this.elementType ?? elementType].enabled) : ElementUtils.getJavaColor(scheme[this.elementType ?? elementType].disabled)
    }

    /**
     * - Gets this element's color scheme for the given colorObject
     * @param {String} colorObj 
     * @returns {JavaColor}
     */
    _getColor(colorObj, key2) {
        if (key2) {
            const scheme = this.colorScheme?.[this.elementType]?.[colorObj]?.[key2] != null ? this.colorScheme : this.defaultColorScheme

            return ElementUtils.getJavaColor(scheme[this.elementType][colorObj][key2])
        }

        const scheme = this.colorScheme?.[this.elementType]?.[colorObj] != null ? this.colorScheme : this.defaultColorScheme

        return ElementUtils.getJavaColor(scheme[this.elementType][colorObj])
    }

    /**
     * - Gets the schemeObject from the color scheme
     * @param {String} schemeObj 
     * @returns {Number|String|Array}
     */
    _getSchemeValue(schemeObj, key2) {
        if (key2) {
            const scheme = this.colorScheme?.[this.elementType]?.[schemeObj]?.[key2] != null ? this.colorScheme : this.defaultColorScheme

            return scheme[this.elementType][schemeObj][key2]
        }

        const scheme = this.colorScheme?.[this.elementType]?.[schemeObj] != null ? this.colorScheme : this.defaultColorScheme

        return scheme[this.elementType][schemeObj]
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