import { UIBlock, UITextInput } from "../../Elementa"
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
    constructor(string = "Placeholder", x = 0, y = 0, width = 150, height = 17) {
        super(x, y, width, height)

        this.string = string
        this.text = null

        // Event handlers
        this.onMouseClickEvent = null
        this.onKeyTypeEvent = null
    }

    /**
     * - Gets the current text in this component
     * @returns {String}
     */
    getText() {
        return this.text
    }

    /**
     * - The function to trigger whenever this component is clicked
     * @param {Function} fn 
     * @returns this for method chaining
     */
    addOnMouseClickEvent(fn) {
        this.onMouseClickEvent = fn
        
        return this
    }

    /**
     * - The function to trigger whenever a key is typed in this component (it returns the full input text in the callback fn)
     * @param {Function} fn 
     * @returns this for method chaining
     */
    addOnKeyTypeEvent(fn) {
        this.onKeyTypeEvent = fn

        return this
    }

    /**
     * - Creates this [TextInputElement] component and returns it
     * @returns {TextInputElement}
     */
    _create() {
        this.bgBox = new UIBlock(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
            .setX(this.x)
            .setY(this.y)
            .setWidth((this.cleanValues.width).pixels())
            .setHeight((this.cleanValues.height).pixels())

        this.textInput = new UITextInput(this.string)
            .setX((2).pixels())
            .setY((2).pixels())
            .setWidth((this.cleanValues.width).pixels())
            .setChildOf(this.bgBox)

        this.textInput.onMouseClick((_, __) => {
            this.textInput.grabWindowFocus()

            if (!this.onMouseClickEvent) return

            this.onMouseClickEvent()
        })

        this.textInput.onKeyType((input, _, __) => {
            this.text = input.getText()

            if (!this.onKeyTypeEvent) return

            this.onKeyTypeEvent(this.text)
        })

        return this.bgBox
    }
}