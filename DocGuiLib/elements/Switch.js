import { Animations, AspectConstraint, CenterConstraint, ConstantColorConstraint, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class SwitchComponent extends BaseElement {
    constructor(enabled = false, string = "Placeholder", x, y, width, height) {
        super(x, y, width, height, enabled)

        this.string = string
    }

    _create() {
        this.box = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))

        this.text = new UIText(this.string)
            .setX((1).pixel())
            .setY(new CenterConstraint())
            .setChildOf(this.box)

        this.switchBox = new UIRoundedRectangle(3)
            .setX((1).pixel(true))
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((12).pixel())
            .setColor(this._getCurrentColor())
            .setChildOf(this.box)

        // Event handlers
        this.switchBox.onMouseClick((component) => {
            if (this._triggerEvent(this.onMouseClick, component) === 1) return

            this.toggle = !this.toggle

            animate(component, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(this._getCurrentColor()),
                    0
                    )
            })
        })

        return this.box
    }
}