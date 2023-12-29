import { Animations, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class CheckboxElement extends BaseElement {
    constructor(check = false, x, y, width, height) {
        super(x, y, width, height, check, null, "Checkbox")
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.colorScheme = colorScheme

        this.checkBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getCurrentColor())
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor([255, 255, 255, 255]), 0.5))

        this.checkBox.onMouseClick((component) => {
            if (this._triggerEvent(this.onMouseClick, component) === 1) return

            this.value = !this.value

            animate(component, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(this._getCurrentColor()),
                    0
                    )
            })
        })

        return this.checkBox
    }
}