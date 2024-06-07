import { MarkdownComponent } from "../../Elementa"
import BaseElement from "./Base"

export default class MarkdownElement extends BaseElement {
    constructor(text, x, y, width, height) {
        super(x, y, width, height, text, null, "Markdown")
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.markDown = new MarkdownComponent(this.getValue())
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            // TODO: maybe figure this out and fix the issues with MD component
            // .setTextScale((this._getSchemeValue("textScale")).pixels())
            // .setColor(this._getColor("backgroundBox"))

        return this.markDown
    }
}