import { Animations, CenterConstraint, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class CheckboxElement extends BaseElement {
    constructor(check = false, x, y, width, height, outline = false) {
        super(x, y, width, height, check, null, "Checkbox", outline)
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.checkBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColorByState())
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.checkMark = new UIText(this.value ? this._getSchemeValue("check", "enabled") : this._getSchemeValue("check", "disabled"))
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("check", "scale")).pixels())
            .setChildOf(this.checkBox)

        this.checkBox.onMouseClick((component) => {
            this.value = !this.value

            if (this._triggerEvent(this.onMouseClick, this.getValue()) === 1) return

            animate(component, (animation) => {
                animation.setColorAnimation(
                    Animations[this._getSchemeValue("mouseClickAnimation", "type")],
                    this._getSchemeValue("mouseClickAnimation", "time"),
                    new ConstantColorConstraint(this._getColorByState()),
                    0
                    )
            })

            this.checkMark.setText(this.value
                ? this._getSchemeValue("check", "enabled")
                : this._getSchemeValue("check", "disabled")
            )
        })

        return this.checkBox
    }

    _getColorByState() {
        return this.getValue() ? this._getColor("background", "enabledColor") : this._getColor("background", "disabledColor")
    }

    setValue(value) {
        this.value = value
        animate(component, (animation) => {
            animation.setColorAnimation(
                Animations[this._getSchemeValue("mouseClickAnimation", "type")],
                this._getSchemeValue("mouseClickAnimation", "time"),
                new ConstantColorConstraint(this._getColorByState()),
                0
                )
        })

        this.checkMark.setText(this.value
            ? this._getSchemeValue("check", "enabled")
            : this._getSchemeValue("check", "disabled")
        )
    }
}