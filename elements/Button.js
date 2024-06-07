import { Animations, CenterConstraint, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, UIWrappedText, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class ButtonElement extends BaseElement {
    /**
     * @param {String} string The string text to render on the button
     */
    constructor(string = "Placeholder", x, y, width, height, outline = false) {
        super(x, y, width, height, string, null, "Button", outline)
    }

    /**
     * - Creates this [Button] component and returns it
     * @returns {Button}
     */
    _create(colorScheme) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        this.button = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))
        
        this.text = new UIWrappedText(this.value)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.button)

        // Event handlers
        this.button.onMouseClick((comp, event) => {
            if (this._triggerEvent(this.onMouseClick, comp, event) === 1) return
            
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations[this._getSchemeValue("mouseClickAnimation", "type")],
                    this._getSchemeValue("mouseClickAnimation", "time"),
                    new ConstantColorConstraint(this._getColor("mouseClickAnimation", "color")),
                    0
                    )
                
                animation.onComplete(() => {
                    comp.setColor(this._getColor("background", "color"))
                })
            })
        })


        return this.button
    }
}