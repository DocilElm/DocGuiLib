import { CramSiblingConstraint, UIBlock, UIWrappedText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class TextDescriptionElement extends BaseElement {
    constructor(string, description, centered = false, x, y, width, height) {
        super(x, y, width, height, string, null, "Text")

        this.centered = centered
        this.description = description
        this.wrapHeight = true
    }

    /**
     * - Whether to wrap the text's height or not
     * @param {boolean} bool 
     * @returns this for method chaining
     */
    setWrapHeight(bool) {
        this.wrapHeight = bool

        return this
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)
        if (elementType) this.elementType = elementType

        this.bgBox = new UIBlock(ElementUtils.getJavaColor([0, 0, 0, 0]))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)

        this.text = new UIWrappedText(this.getValue(), true, null, this.centered, true, 10, "...")
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth((98).percent())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.bgBox)

        this.descriptionElement = new UIWrappedText(this.description, true, null, this.centered, true, 10, "...")
            .setX((0).percent())
            .setY(new CramSiblingConstraint(2))
            .setWidth((98).percent())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color").darker())
            .setChildOf(this.bgBox)

        if (this.wrapHeight) {
            this.text.setHeight((30).percent())
            this.descriptionElement.setHeight((75).percent())
        }

        return this.bgBox
    }
}