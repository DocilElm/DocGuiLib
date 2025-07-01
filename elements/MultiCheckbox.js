import { CenterConstraint, CramSiblingConstraint, OutlineEffect, ScrollComponent, UIRoundedRectangle, UIText, UIWrappedText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"
import CheckboxElement from "./Checkbox"

export default class MultiCheckboxElement extends BaseElement {
    constructor(options = [], placeholder = "Click", x, y, width, height) {
        super(x, y, width, height, 0, null, "MultiCheckBox")

        this.placeholder = placeholder
        this.options = options
        this.checkboxes = {}
        this.hidden = true
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.bgBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.textBgBox = new UIRoundedRectangle(this._getSchemeValue("placeholderbackground", "roundness"))
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((75).percent())
            .setHeight((100).percent())
            .setColor(this._getColor("placeholderbackground", "color"))
            .enableEffect(new OutlineEffect(this._getColor("placeholderbackground", "outlineColor"), this._getSchemeValue("placeholderbackground", "outlineSize")))
            .setChildOf(this.bgBox)

        this.placeholderText = new UIWrappedText(this.placeholder, true, null, true, true, 10)
            .setX((1).pixels())
            .setY((new CenterConstraint()))
            .setWidth((100).percent())
            .setColor(this._getColor("placeholdertext", "color"))
            .setTextScale((this._getSchemeValue("placeholdertext", "scale")).pixels())
            .setChildOf(this.textBgBox)

        this.arrowText = new UIText(this._getSchemeValue("text", "openArrow"))
            .setX(new CramSiblingConstraint(5))
            .setY(new CenterConstraint())
            .setColor(this._getColor("text", "color"))
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setChildOf(this.bgBox)

        this.dropDownBg = new UIRoundedRectangle(this._getSchemeValue("dropdownbackground", "roundness"))
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint(5))
            .setWidth((200).percent())
            .setHeight((600).percent())
            .enableEffect(new OutlineEffect(this._getColor("dropdownbackground", "outlineColor"), this._getSchemeValue("dropdownbackground", "outlineSize")))
            .setColor(this._getColor("dropdownbackground", "color"))
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
            checkBox
                ._create(this.colorScheme[this.elementType])
                .setChildOf(optionBg)
            this.checkboxes[obj.configName] = checkBox

            const mainBox = new UIRoundedRectangle(this._getSchemeValue("optionsbackground", "roundness"))
                .setX((22).percent())
                .setY((0).pixels())
                .setWidth((75).percent())
                .setHeight((100).percent())
                .setColor(this._getColor("optionsbackground", "color"))
                .enableEffect(new OutlineEffect(this._getColor("optionsbackground", "outlineColor"), this._getSchemeValue("optionsbackground", "outlineSize")))
                .setChildOf(optionBg)

            const mainBoxText = new UIWrappedText(obj.title, true, null, true, true)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((100).percent())
                .setColor(this._getColor("optionstext", "color"))
                .setTextScale((this._getSchemeValue("optionstext", "scale")).pixels())
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

        this.arrowText.setText(this._getSchemeValue("text", "openArrow"))
        this.dropDownBg.hide(true)
        this.dropDownBg.setFloating(false)
        this.hidden = true
    }

    _unhideDropDown() {
        if (!this.hidden) return

        this.arrowText.setText(this._getSchemeValue("text", "closeArrow"))
        this.dropDownBg.unhide(true)
        this.dropDownBg.setFloating(true)
        this.hidden = false
    }

    setValue(configName, value) {
        if (!(configName in this.checkboxes)) return

        this.checkboxes[configName].setValue(value)
    }
}