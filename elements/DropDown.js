import { CenterConstraint, CramSiblingConstraint, OutlineEffect, ScrollComponent, UIRoundedRectangle, UIText, UIWrappedText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class DropDownElement extends BaseElement {
    constructor(options = [], value = 0, x, y, width, height) {
        super(x, y, width, height, value, null, "DropDown")

        this.defaultValue = value
        this.options = options
        this.maxOptLength = this.options.length - 1
        this.value = ElementUtils.miniMax(0, this.maxOptLength, value)
        this.hidden = true
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        if (this.defaultValue < 0 || this.defaultValue > this.maxOptLength) {
            this._triggerEvent(this.onMouseClick, this.value)
        }

        this.bgBox = new UIRoundedRectangle(5)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .enableEffect(new OutlineEffect(this._getColor("backgroundBoxOutlineColor"), this._getSchemeValue("backgroundBoxOutlineThickness")))
            .setColor(this._getColor("backgroundBox"))

        this.currentSelection = new UIRoundedRectangle(5)
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((75).percent())
            .setHeight((100).percent())
            .enableEffect(new OutlineEffect(this._getColor("selectionBackgroundBoxOutlineColor"), this._getSchemeValue("selectionBackgroundBoxOutlineThickness")))
            .setColor(this._getColor("selectionBackgroundBox"))
            .setChildOf(this.bgBox)

        this.currentSelectionText = new UIWrappedText(this.options[this.value], true, null, true, true, 10)
            .setX((1).pixels())
            .setY((new CenterConstraint()))
            .setWidth((100).percent())
            .setColor(this._getColor("selectionTextColor"))
            .setTextScale((this._getSchemeValue("selectionTextScale")).pixels())
            .setChildOf(this.currentSelection)

        this.arrowText = new UIText(this._getSchemeValue("hideArrowText"))
            .setX(new CramSiblingConstraint(5))
            .setY(new CenterConstraint())
            .setColor(this._getColor("arrowTextColor"))
            .setTextScale((this._getSchemeValue("arrowTextScale")).pixels())
            .setChildOf(this.bgBox)

        this.dropDownBg = new UIRoundedRectangle(5)
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint(5))
            .setWidth((200).percent())
            .setHeight((600).percent())
            .enableEffect(new OutlineEffect(this._getColor("dropDownBackgroundBoxOutlineColor"), this._getSchemeValue("dropDownBackgroundBoxOutlineThickness")))
            .setColor(this._getColor("dropDownBackgroundBox"))
            .setChildOf(this.bgBox)

        this.dropDownScrollable = new ScrollComponent("", 5)
            .setX((1).pixels())
            .setY((1).pixels())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.dropDownBg)

        this.options.forEach((name, idx) => {
            const mainBox = new UIRoundedRectangle(5)
                .setX((3).pixels())
                .setY(new CramSiblingConstraint(5))
                .setWidth((89).percent())
                .setHeight((20).percent())
                .setColor(this._getColor("optionsBackgroundBox"))
                .enableEffect(new OutlineEffect(this._getColor("optionsBackgroundBoxOutlineColor"), this._getSchemeValue("optionsBackgroundBoxOutlineThickness")))
                .setChildOf(this.dropDownScrollable)
                .onMouseClick((comp, event) => {
                    if (event.mouseButton !== 0) return

                    this.value = idx
                    if (this._triggerEvent(this.onMouseClick, this.getValue()) === 1) return

                    this.currentSelectionText.setText(this.options[this.getValue()])
                    this._hideDropDown()
                })

            const mainBoxText = new UIWrappedText(name, true, null, true, true)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((100).percent())
                .setColor(this._getColor("optionsTextColor"))
                .setTextScale((this._getSchemeValue("optionsTextScale")).pixels())
                .setChildOf(mainBox)
        })

        this.dropDownBg.hide(true)

        // Events
        this.currentSelection.onMouseClick(this._onMouseClick.bind(this))
        this.arrowText.onMouseClick(this._onMouseClick.bind(this))

        this.dropDownScrollable
            // Avoid these events going to the parent component
            .onMouseClick((comp, event) => event.stopPropagation())
            .onMouseScroll((comp, event) => event.stopPropagation())

        return this.bgBox
    }

    _onMouseClick(comp, event) {
        event.stopPropagation()

        if (this.hidden) return this._unhideDropDown()

        this._hideDropDown()
    }

    _hideDropDown() {
        if (this.hidden) return

        this.arrowText.setText(this._getSchemeValue("hideArrowText"))
        this.dropDownBg.hide(true)
        this.dropDownBg.setFloating(false)
        this.hidden = true
    }

    _unhideDropDown() {
        if (!this.hidden) return

        this.arrowText.setText(this._getSchemeValue("unhideArrowText"))
        this.dropDownBg.unhide(true)
        this.dropDownBg.setFloating(true)
        this.hidden = false
    }
}