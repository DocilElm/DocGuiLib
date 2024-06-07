import { CenterConstraint, OutlineEffect, UIRoundedRectangle, UIText } from "../../Elementa"
import BaseElement from "./Base"

export default class DividerElement extends BaseElement {
    constructor(text, x, y, width, height) {
        super(x, y, width, height, text, null, "Divider")
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.backgroundBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.textValue = new UIText(this.getValue())
            .setX(new CenterConstraint())
            .setY((10).percent())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.backgroundBox)

        this.line = new UIRoundedRectangle(this._getSchemeValue("line", "roundness"))
            .setX((1).pixel())
            .setY((80).percent())
            .setWidth((99.5).percent())
            .setHeight((2).pixel())
            .setColor(this._getColor("line", "color"))
            .enableEffect(new OutlineEffect(this._getColor("line", "outlineColor"), this._getSchemeValue("line", "outlineSize")))
            .setChildOf(this.backgroundBox)

        return this.backgroundBox
    }
}