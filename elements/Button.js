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

        this.button = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))
        
        if (this.outline) this.button.enableEffect(new OutlineEffect(this._getColor("outlineColor"), this._getSchemeValue("outlineThickness")))

        this.text = new UIWrappedText(this.value)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("textScale")).pixels())
            .setColor(this._getColor("textColor"))
            .setChildOf(this.button)

        // Event handlers
        this.button.onMouseClick((comp, event) => {
            if (this._triggerEvent(this.onMouseClick, comp, event) === 1) return
            
            animate(comp, (animation) => {
                animation.setColorAnimation(
                    Animations[this._getSchemeValue("mouseClickAnimation")],
                    this._getSchemeValue("animationTime"),
                    new ConstantColorConstraint(this._getColor("mouseClick")),
                    0
                    )
                
                animation.onComplete(() => {
                    comp.setColor(this._getColor("backgroundBox"))
                })
            })
        })


        return this.button
    }
}