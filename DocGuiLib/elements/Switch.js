import { Animations, AspectConstraint, CenterConstraint, ConstantColorConstraint, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class SwitchComponent extends BaseElement {
    constructor(enabled = false, string = "Placeholder", description = "Placeholder", x, y, width, height) {
        super(x, y, width, height)

        this.enabled = enabled
        this.string = string
        this.description = description

        this.colors = {
            on: new ElementUtils.JavaColor(0 / 255, 255 / 255, 0 / 255, 100 / 255),
            off: new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 100 / 255) 
        }
    }

    /**
     * - Gets the current state of this component [enabled/disabled]
     * @returns {Boolean}
     */
    getValue() {
        return this.enabled
    }

    _getCurrentColor() {
        return this.enabled ? this.colors.on : this.colors.off
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

        this.hoverText = new UIText(this.description)
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
            this.enabled = !this.enabled

            animate(component, (animation) => {
                animation.setColorAnimation(
                    Animations.OUT_EXP,
                    0.5,
                    new ConstantColorConstraint(this._getCurrentColor()),
                    0
                    )
            })
        })

        this.hoverText.hide()

        this.text.onMouseEnter((component) => {
            component.hide()
            this.hoverText.unhide(true)
        })

        this.hoverText.onMouseLeave((component) => {
            this.text.unhide(true)
            component.hide()
        })

        return this.box
    }
}