const hexColorRegex = /^([a-f0-9]{6})([a-f0-9]{2})?/i

export default class ElementUtils {
    static JavaColor = java.awt.Color
    
    /**
     * - Gets the pixel from the percent given
     * @param {Number} percent 
     * @param {Number} value The height or width value
     * @returns {Number}
     */
    static percentToPixel(percent, value) {
        return (percent / 100) * value
    }

    /**
     * - Checks whether the given string matches a hex color regex
     * @param {String} hex 
     * @returns {Boolean}
     */
    static isHexColor(hex) {
        return hexColorRegex.test(hex)
    }

    /**
     * - Converts the given [Hex] string into a [r, g, b] values
     * @param {String} hex 
     * @returns {[Number, Number, Number]}
     */
    static hexToRgb(hex) {
        if (!this.isHexColor(hex)) return null

        const [ r, g, b, a ] = hex.match(/[a-f0-9]{2}/gi)?.map(value => parseInt(value, 16))

        return [ r, g, b, a ?? 255 ]
    }

    /**
     * - Returns the java color for this array [ r, g, b, a ]
     * @param {[Number,Number,Number,Number]} param0 
     * @returns {JavaColor}
     */
    static getJavaColor([r, g, b, a = 255]) {
        return new this.JavaColor(r / 255, g / 255, b / 255, a / 255)
    }

    /**
     * - Converts the given [r, g, b, a] array into [Hex] string
     * @param {[Number, Number, Number, Number]} rgb 
     * @returns {String}
     */
    static rgbToHex([r, g, b, a]) {
        return [r, g, b, a].map(x => {
            const hex = (x ?? 255).toString(16).toUpperCase()
            return hex.length === 1 ? "0" + hex : hex
          }).join("")
    }

    /**
     * - Gets a number that's between the given [min] and [max]
     * - without letting the value go under [min] or over [max]
     * @param {Number} min 
     * @param {Number} max 
     * @param {Number} value 
     * @returns {Number}
     */
    static miniMax(min, max, value) {
        return Math.min(Math.max(value, min), max)
    }
}