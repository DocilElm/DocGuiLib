import { Animations, AspectConstraint, CenterConstraint, UIRoundedRectangle, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class SwitchElement extends BaseElement {
    constructor(enabled = false, x, y, width, height) {
        super(x, y, width, height, enabled, null, "Switch")
    }

    _getPosition() {
        return this.getValue() ? (1).pixel(true) : (1).pixel()
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.colorScheme = colorScheme

        this.box = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getCurrentColor())

        this.switchBox = new UIRoundedRectangle(3)
            .setX(this._getPosition())
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((12).pixel())
            .setColor(this._getColor("backgroundBox"))
            .setChildOf(this.box)

        this.switchBox
            .onMouseClick((component) => {
                if (this._triggerEvent(this.onMouseClick, component) === 1) return

                this.value = !this.value
                this.box.setColor(this._getCurrentColor())

                animate(component, (animation) => {
                    animation.setXAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        this._getPosition()
                    )
                })
            })

        return this.box
    }
}