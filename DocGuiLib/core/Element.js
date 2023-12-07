const hexColorRegex = /^([abcdef0123456789]{6})$/gi

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

        const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(value => parseInt(value, 16))

        if (!rgb.length) return null

        return rgb
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
     * - Converts the given [r, g, b] array into [Hex] string
     * @param {[Number, Number, Number]} rgb 
     * @returns {String}
     */
    static rgbToHex([r, g, b]) {
        return [r, g, b].map(x => {
            const hex = x.toString(16).toUpperCase()
            return hex.length === 1 ? "0" + hex : hex
          }).join("")
    }
      
}