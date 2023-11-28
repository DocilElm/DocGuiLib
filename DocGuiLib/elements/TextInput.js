import { UIBlock, UITextInput } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class TextInputElement extends BaseElement {
    constructor(string = "Placeholder", x = 0, y = 0, width = 150, height = 17) {
        this.string = string
        this.text = null

        this.setSize(width, height, false)
        this.setPosition(x, y, false)
    }

    _create() {
        this.bgBox = new UIBlock(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)

        this.textInput = new UITextInput(this.string)
            .setX((2).pixels())
            .setY((2).pixels())
            .setWidth(this.width)
            .setChildOf(this.bgBox)

        this.textInput.onMouseClick((_, __) => {
            this.textInput.grabWindowFocus()
        })

        this.textInput.onKeyType((input, _, __) => {
            this.text = input.getText()
        })

        return this.bgBox
    }
}