import { Animations, CenterConstraint, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, animate } from "../../Elementa"
import BaseElement from "./Base"
import TextElement from "./Text"

export default class Button1Element extends BaseElement {
    constructor(string = "Placeholder", x, y, width, height) {
        super(x, y, width, height, null, null, "Button1")

        this.string = string
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.colorScheme = colorScheme

        // Invis box to hold everything
        this.backgroundBox = new UIRoundedRectangle(5)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))
            .enableEffect(new OutlineEffect(this._getColor("outlineColor"), this._getSchemeValue("outlineThickness")))

        // If [centered] text is disabled we should draw the lines
        if (!this._getSchemeValue("centered")) {
            // Vertical line
            this.line1 = new UIRoundedRectangle(3)
                .setX((1).percent())
                .setY(new CenterConstraint())
                .setWidth((2).percent())
                .setHeight((50).percent())
                .setColor(this._getColor("lines"))
                .setChildOf(this.backgroundBox)
            
            // Horizontal line
            this.line2 = new UIRoundedRectangle(3)
                .setX((1).percent())
                .setY((70).percent())
                .setWidth((80).percent())
                .setHeight((8).percent())
                .setColor(this._getColor("lines"))
                .setChildOf(this.backgroundBox)
        }

        // Centered to lines text
        const [ x, y, width, height ] = [
            (8).percent(),
            (20).percent(),
            (80).percent(),
            this.height
        ]

        this.text = new TextElement(this.getString(), this._getSchemeValue("centered"))
            ._setPosition(x, y)
            ._setSize(width, height)
            ._create(this.colorScheme)
            .setChildOf(this.backgroundBox)

        // Events handler
        this.backgroundBox
            .onMouseEnter((comp, event) => {
                if (this._triggerEvent(this.onMouseEnter, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseEnterAnimation")],
                        this._getSchemeValue("mouseEnterAnimationTime"),
                        new ConstantColorConstraint(this._getColor("mouseEnter")),
                        0
                        )
                })
            })
            .onMouseLeave((comp, event) => {
                if (this._triggerEvent(this.onMouseLeave, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseLeaveAnimation")],
                        this._getSchemeValue("mouseLeaveAnimationTime"),
                        new ConstantColorConstraint(this._getColor("mouseLeave")),
                        0
                        )
                })
            })
            .onMouseClick((comp, event) => {
                if (this._triggerEvent(this.onMouseClick, comp, event) === 1) return
                
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseClickAnimation")],
                        this._getSchemeValue("mouseClickAnimationTime"),
                        new ConstantColorConstraint(this._getColor("mouseClick")),
                        0
                        )
                    
                    animation.onComplete(() => {
                        comp.setColor(this._getColor("backgroundBox"))
                    })
                })
            })

        return this.backgroundBox
    }
}