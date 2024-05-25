import { CenterConstraint, UIRoundedRectangle, UIText } from "../../Elementa"
import BaseElement from "./Base"

export default class DividerElement extends BaseElement {
    constructor(text, x, y, width, height) {
        super(x, y, width, height, text, null, "Divider")
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))

        this.textValue = new UIText(this.getValue())
            .setX(new CenterConstraint())
            .setY((10).percent())
            .setTextScale((this._getSchemeValue("textScale")).pixels())
            .setColor(this._getColor("textColor"))
            .setChildOf(this.backgroundBox)

        this.line = new UIRoundedRectangle(3)
            .setX((1).pixel())
            .setY((80).percent())
            .setWidth((99.5).percent())
            .setHeight((2).pixel())
            .setColor(this._getColor("line"))
            .setChildOf(this.backgroundBox)

        return this.backgroundBox
    }
}