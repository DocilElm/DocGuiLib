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
}