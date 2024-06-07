import { CenterConstraint, CramSiblingConstraint, OutlineEffect, ScrollComponent, UIRoundedRectangle, UIText, UIWrappedText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"
import CheckboxElement from "./Checkbox"

export default class MultiCheckboxElement extends BaseElement {
    constructor(options = [], placeholder = "Click", x, y, width, height) {
        super(x, y, width, height, 0, null, "MultiCheckBox")

        this.placeholder = placeholder
        this.options = options
        this.hidden = true
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.bgBox = new UIRoundedRectangle(5)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .enableEffect(new OutlineEffect(this._getColor("backgroundBoxOutlineColor"), this._getSchemeValue("backgroundBoxOutlineThickness")))
            .setColor(this._getColor("backgroundBox"))

        this.textBgBox = new UIRoundedRectangle(5)
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((75).percent())
            .setHeight((100).percent())
            .enableEffect(new OutlineEffect(this._getColor("textBackgroundBoxOutlineColor"), this._getSchemeValue("textBackgroundBoxOutlineThickness")))
            .setColor(this._getColor("textBackgroundBox"))
            .setChildOf(this.bgBox)

        this.placeholderText = new UIWrappedText(this.placeholder, true, null, true, true, 10)
            .setX((1).pixels())
            .setY((new CenterConstraint()))
            .setWidth((100).percent())
            .setColor(this._getColor("placeholderTextColor"))
            .setTextScale((this._getSchemeValue("placeholderTextScale")).pixels())
            .setChildOf(this.textBgBox)

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
            .setX((-1).pixels())
            .setY((0).pixels())
            .setWidth((98).percent())
            .setHeight((98).percent())
            .setChildOf(this.dropDownBg)

        this.options.forEach((obj, idx) => {
            const optionBg = new UIRoundedRectangle(5)
                .setX((0).pixels())
                .setY(new CramSiblingConstraint(5))
                .setWidth((100).percent())
                .setHeight((20).percent())
                .setColor(ElementUtils.getJavaColor([0, 0, 0, 0]))
                .setChildOf(this.dropDownScrollable)

            const checkBox = new CheckboxElement(obj.value, 0, 0, 20, 100, false)
                .onMouseClickEvent((value) => {
                    this._triggerEvent(this.onMouseClick, obj.configName, value)
                })
                ._create(this.colorScheme[this.elementType])
                .setChildOf(optionBg)

            const mainBox = new UIRoundedRectangle(5)
                .setX((22).percent())
                .setY((0).pixels())
                .setWidth((75).percent())
                .setHeight((100).percent())
                .setColor(this._getColor("optionsBackgroundBox"))
                .enableEffect(new OutlineEffect(this._getColor("optionsBackgroundBoxOutlineColor"), this._getSchemeValue("optionsBackgroundBoxOutlineThickness")))
                .setChildOf(optionBg)

            const mainBoxText = new UIWrappedText(obj.title, true, null, true, true)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((100).percent())
                .setColor(this._getColor("optionsTextColor"))
                .setTextScale((this._getSchemeValue("optionsTextScale")).pixels())
                .setChildOf(mainBox)
        })

        this.dropDownBg.hide(true)

        // Events
        this.textBgBox.onMouseClick(this._onMouseClick.bind(this))
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