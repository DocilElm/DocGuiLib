import { Animations, AspectConstraint, CenterConstraint, OutlineEffect, UIRoundedRectangle, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class SwitchElement extends BaseElement {
    constructor(enabled = false, x, y, width, height, outline = false) {
        super(x, y, width, height, enabled, null, "Switch", outline)
    }

    _getPosition() {
        return this.getValue() ? (1).pixel(true) : (1).pixel()
    }

    _getColorByState() {
        return this.getValue() ? this._getColor("switchBoxEnabled") : this._getColor("switchBoxDisabled")
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.box = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getCurrentColor())

        if (this.outline) this.box.enableEffect(new OutlineEffect(this._getColor("outlineColor"), this._getSchemeValue("outlineThickness")))

        this.switchBox = new UIRoundedRectangle(3)
            .setX(this._getPosition())
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((12).pixel())
            .setColor(this._getColorByState())
            .setChildOf(this.box)

        this.box
            .onMouseClick((component) => {
                if (this._triggerEvent(this.onMouseClick, component) === 1) return

                this.value = !this.value

                this.box.setColor(this._getCurrentColor())
                this.switchBox.setColor(this._getColorByState())

                animate(this.switchBox, (animation) => {
                    animation.setXAnimation(
                        Animations[this._getSchemeValue("mouseClickAnimation")],
                        this._getSchemeValue("animationTime"),
                        this._getPosition()
                    )
                })
            })

        return this.box
    }
}