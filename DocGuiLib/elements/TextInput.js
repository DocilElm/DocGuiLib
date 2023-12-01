import { UIRoundedRectangle, UITextInput } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class TextInputElement extends BaseElement {
    /**
     * @param {String} string The placeholder text
     * @param {Number} x This component's x value (default in percent)
     * @param {Number} y This component's y value (default in percent)
     * @param {Number} width This component's width value in pixels
     * @param {Number} height This component's height value in pixels
     */
    constructor(string = "Placeholder", x = 0, y = 0, width = 150, height = 8) {
        super(x, y, width, height)

        this.string = string
        this.text = null
    }

    /**
     * - Gets the current text in this component
     * @returns {String}
     */
    getText() {
        return this.text
    }

    /**
     * - Creates this [TextInputElement] component and returns it
     * @returns {TextInputElement}
     */
    _create() {
        this.bgBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))

        this.textInput = new UITextInput(this.string)
            .setX((1).pixels())
            .setY((1).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .setChildOf(this.bgBox)

        this.textInput.onMouseClick((_, __) => {
            if (this._triggerEvent(this.onMouseClick) === 1) return

            this.textInput.grabWindowFocus()
        })

        this.textInput.onKeyType((input, _, __) => {
            if (this._triggerEvent(this.onKeyType, input.getText()) === 1) return
            
            this.text = input.getText()
        })

        return this.bgBox
    }
}