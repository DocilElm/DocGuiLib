import { UIWrappedText } from "../../Elementa"
import BaseElement from "./Base"

export default class TextDescriptionElement extends BaseElement {
    constructor(string, description, centered = false, x, y, width, height) {
        super(x, y, width, height, string, null, "Text")

        this.centered = centered
        this.description = description
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

        this.descriptionElement = new UIWrappedText(this.description, true, null, this.centered, true, 10, "...")
            .setX(this.x)
            .setY((11).pixel())
            .setWidth(this.width)
            .setHeight(this.height)
            .setTextScale((this._getSchemeValue("textScale")).pixel())
            .setColor(this._getColor("textColor").darker())
            .setChildOf(this.text)

        return this.text
    }
}