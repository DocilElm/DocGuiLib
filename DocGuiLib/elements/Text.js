import { CenterConstraint, UIRoundedRectangle, UIText, UIWrappedText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class TextElement extends BaseElement {
    constructor(string, centered = false, x, y, width, height) {
        super(x, y, width, height, string, null, "Text")

        this.centered = centered
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)
        if (elementType) this.elementType = elementType

        this.text = new UIWrappedText(this.getValue(), true, null, this.centered, true, 5.0, "...")
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight((10).pixel())
            .setTextScale((this._getSchemeValue("textScale")).pixel())
            .setColor(this._getColor("textColor"))

        this.hover = new UIWrappedText("something something description of this component &4also format", true, null, true)
            // .setX(new CenterConstraint())
            // .setY(new CenterConstraint())
            .setWidth(this.width)
            .setChildOf(this.text)

        this.hover.hide()

        this.text
            .onMouseEnter((comp, event) => {
                this.hover.unhide(true)
                comp.setText("")
            })
            .onMouseLeave((comp, event) => {
                this.hover.hide()
                comp.setText(this.getValue())
            })

        return this.text
    }
}