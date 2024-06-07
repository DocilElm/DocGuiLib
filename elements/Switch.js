import { Animations, AspectConstraint, CenterConstraint, OutlineEffect, UIRoundedRectangle, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class SwitchElement extends BaseElement {
    constructor(enabled = false, x, y, width, height, outline = false) {
        super(x, y, width, height, enabled, null, "Switch", outline)
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.backgroundBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColorByStateBackground())
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.switchBox = new UIRoundedRectangle(this._getSchemeValue("switchbox", "roundness"))
            .setX(this._getPosition())
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((80).percent())
            .setColor(this._getColorByState())
            .enableEffect(new OutlineEffect(this._getColor("switchbox", "outlineColor"), this._getSchemeValue("switchbox", "outlineSize")))
            .setChildOf(this.backgroundBox)

        this.backgroundBox
            .onMouseClick((component) => {
                if (this._triggerEvent(this.onMouseClick, component) === 1) return

                this.value = !this.value

                this.backgroundBox.setColor(this._getColorByStateBackground())
                this.switchBox.setColor(this._getColorByState())

                animate(this.switchBox, (animation) => {
                    animation.setXAnimation(
                        Animations[this._getSchemeValue("mouseClickAnimation", "type")],
                        this._getSchemeValue("mouseClickAnimation", "time"),
                        this._getPosition()
                    )
                })
            })

        return this.backgroundBox
    }

    _getPosition() {
        return this.getValue() ? (1).pixel(true) : (1).pixel()
    }

    _getColorByState() {
        return this.getValue() ? this._getColor("switchbox", "enabledColor") : this._getColor("switchbox", "disabledColor")
    }

    _getColorByStateBackground() {
        return this.getValue() ? this._getColor("background", "enabledColor") : this._getColor("background", "disabledColor")
    }
}