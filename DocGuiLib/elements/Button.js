import { AdditiveConstraint, Animations, CenterConstraint, ConstantColorConstraint, SiblingConstraint, UIRoundedRectangle, UIWrappedText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"

export default class ButtonElement {
    /**
     * @param {String} string The string text to render on the button
     * @param {Function} handler The function to trigger whenever this element is clicked
     * @param {Boolean} toggle The starting toggle value
     */
    constructor(string = "Placeholder", handler = null, toggle = false) {

        this.string = string
        this.handler = handler
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
     * - Adds the handler for whenever this [Button] is clicked it'll trigger that function
     * @param {Function} func 
     * @returns this for method chaining
     */
    addHandler(func) {
        this.handler = func

        return this
    }

    /**
     * - Creates this [Button] component and returns it
     * @returns {Button}
     */
    _create() {
        this.btn = new UIRoundedRectangle(5)
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(new SiblingConstraint(), (3).pixels()))
            .setWidth((100).pixels())
            .setHeight((20).pixels())

            .onMouseClick((comp, event) => {
                if (!this.handler) return

                this.toggle = !this.toggle

                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        new ConstantColorConstraint(this.getCurrentColor()),
                        0
                        )
                })

                this.handler(comp, event)
            })

            .setColor(this.getCurrentColor())

        new UIWrappedText(this.string, true, null, true)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((100).pixels())
                .setChildOf(this.btn)

        return this.btn
    }
}

// Maybe if i make this better it would actually be useful
// export class ButtonArrayElement {
//     constructor(array = []) {
//         this.btnArray = array
//     }

//     create() {
//         if (!(this.btnArray instanceof Array)) return

//         let buttons = []

//         this.btnArray.forEach(button => {
//             buttons.push(new ButtonElement(button[0], button[1], button[2]))
//         })

//         return buttons
//     }
// }