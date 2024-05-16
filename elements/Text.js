import { UIWrappedText } from "../../Elementa"
import BaseElement from "./Base"

export default class TextElement extends BaseElement {
    constructor(string, centered = false, x, y, width, height) {
        super(x, y, width, height, string, null, "Text")

        this.centered = centered
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)
        if (elementType) this.elementType = elementType

        this.text = new UIWrappedText(this.getValue(), true, null, this.centered, true, 10, "...")
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setTextScale((this._getSchemeValue("textScale")).pixel())
            .setColor(this._getColor("textColor"))

        this.hover = new UIWrappedText("", true, null, true)
            .setWidth(this.width)
            .setChildOf(this.text)

        this.hover.hide()

        this.text
            .onMouseEnter((comp, event) => {
                if (!this.string) return

                this.hover.setText(this.string)
                this.hover.unhide(true)
                comp.setText("")
            })
            .onMouseLeave((comp, event) => {
                if (!this.string) return

                this.hover.hide()
                comp.setText(this.getValue())
            })

        return this.text
    }
}