import { Animations, CenterConstraint, ConstantColorConstraint, UIRoundedRectangle, UIWrappedText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class ButtonElement extends BaseElement {
    /**
     * @param {String} string The string text to render on the button
     * @param {Function} handler The function to trigger whenever this element is clicked
     * @param {Boolean} toggle The starting toggle value
     */
    constructor(string = "Placeholder", toggle = false, x, y, width, height) {
        super(x, y, width, height)

        this.string = string
        this.toggle = toggle

        this.enabledColor = new ElementUtils.JavaColor(255 / 255, 255 / 255, 255 / 255, 80/255)
        this.disabledColor = new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255)
    }

    /**
     * - Sets the current [button]'s string text
     * @param {String} string 
     * @returns this for method chaining
     */
    setString(string) {
        this.string = string
        
        return this
    }

    /**
     * - Sets the colors for the toggle button
     * @param {Array} enabledColor An array of colors [r, g, b, a]
     * @param {Array} disabledColor An array of colors [r, g, b, a]
     * @returns this for method chaining
     */
    setColors(enabledColor = [], disabledColor = []) {
        if (enabledColor)
            this.enabledColor = new ElementUtils.JavaColor(enabledColor[0] / 255, enabledColor[1] / 255, enabledColor[2] / 255, enabledColor[3]/255)
        if (disabledColor)
            this.disabledColor = new ElementUtils.JavaColor(disabledColor[0] / 255, disabledColor[1] / 255, disabledColor[2] / 255, disabledColor[3] / 255)

        return this
    }

    /**
     * - Returns the current toggle value for this component
     * @returns {Boolean}
     */
    getToggle() {
        return this.toggle
    }

    /**
     * - Gets the current toggle value's [r, g, b]
     * @returns {[Number, Number, Number]}
     */
    getCurrentColor() {
        return this.toggle ? this.enabledColor : this.disabledColor
    }

    /**
     * - Creates this [Button] component and returns it
     * @returns {Button}
     */
    _create() {
        this.button = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this.getCurrentColor())

        this.text = new UIWrappedText(this.string)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.button)

        // Event handlers
        this.button.onMouseClick((comp, event) => {
            if (this._triggerEvent(this.onMouseClick) === 1) return
            
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(this.enabledColor),
                    0
                    )
                
                animation.onComplete(() => {
                    comp.setColor(this.disabledColor)
                })
            })
        })


        return this.button
    }
}