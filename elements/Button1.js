import { Animations, CenterConstraint, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, UIWrappedText, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class Button1Element extends BaseElement {
    constructor(string = "Placeholder", x, y, width, height) {
        super(x, y, width, height, null, null, "Button1")

        this.string = string
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.colorScheme = colorScheme

        // Invis box to hold everything
        this.backgroundBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        // If [centered] text is disabled we should draw the lines
        if (!this._getSchemeValue("text", "centered")) {
            // Vertical line
            this.line1 = new UIRoundedRectangle(this._getSchemeValue("lines", "roundness"))
                .setX((3).percent())
                .setY(new CenterConstraint())
                .setWidth((2).percent())
                .setHeight((70).percent())
                .setColor(this._getColor("lines", "color"))
                .setChildOf(this.backgroundBox)
            
            // Horizontal line
            this.line2 = new UIRoundedRectangle(this._getSchemeValue("lines", "roundness"))
                .setX((3).percent())
                .setY((80).percent())
                .setWidth((80).percent())
                .setHeight((8).percent())
                .setColor(this._getColor("lines", "color"))
                .setChildOf(this.backgroundBox)
        }

        this.text = new UIWrappedText(`${this._getSchemeValue("text", "format")}${this.getString()}`, true, null, this._getSchemeValue("text", "centered"))
            .setX(this._getSchemeValue("text", "centered") ? new CenterConstraint() : (9).percent())
            .setY(this._getSchemeValue("text", "centered") ? new CenterConstraint() : (30).percent())
            .setWidth((100).percent())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.backgroundBox)

        // Events handler
        this.backgroundBox
            .onMouseEnter((comp, event) => {
                if (this._triggerEvent(this.onMouseEnter, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseEnterAnimation", "type")],
                        this._getSchemeValue("mouseEnterAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseEnterAnimation", "color")),
                        0
                        )
                })
            })
            .onMouseLeave((comp, event) => {
                if (this._triggerEvent(this.onMouseLeave, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseLeaveAnimation", "type")],
                        this._getSchemeValue("mouseLeaveAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseLeaveAnimation", "color")),
                        0
                        )
                })
            })
            .onMouseClick((comp, event) => {
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

        return this.backgroundBox
    }
}