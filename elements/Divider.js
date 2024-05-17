import { CenterConstraint, UIRoundedRectangle, UIText } from "../../Elementa"
import BaseElement from "./Base"

export default class DividerElement extends BaseElement {
    constructor(text, x, y, width, height) {
        super(x, y, width, height, text, null, "Divider")
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.colorScheme = colorScheme

        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))

        this.textValue = new UIText(this.getValue())
            .setX(new CenterConstraint())
            .setY((10).percent())
            .setTextScale((this._getSchemeValue("textScale")).pixel())
            .setColor(this._getColor("textColor"))
            .setChildOf(this.backgroundBox)

        // this.textValue = new UIWrappedText(this.getValue(), true, null, true, true, 10, "...")
        //     .setX((1).pixel())
        //     .setY((1).pixel())
        //     .setWidth(this.width)
        //     .setHeight(this.height)
        //     .setTextScale((this._getSchemeValue("textScale")).pixel())
        //     .setColor(this._getColor("textColor"))
        //     .setChildOf(this.backgroundBox)

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