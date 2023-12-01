import { Animations, CenterConstraint, ConstantColorConstraint, UIRoundedRectangle, UIWrappedText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class Button1Element extends BaseElement {
    constructor(string = "Placeholder", x, y, width, height) {
        super(x, y, width, height)

        this.string = string
    }

    _create() {
        // Invis box to hold everything
        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(new ElementUtils.JavaColor(0, 0, 0, 0))

        // Vertical line
        this.line1 = new UIRoundedRectangle(3)
            .setX((1).pixel())
            .setY(new CenterConstraint())
            .setWidth((2).pixel())
            .setHeight((10).pixel())
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
            .setChildOf(this.backgroundBox)
    
        // Horizontal line
        this.line2 = new UIRoundedRectangle(3)
            .setX((2).pixel())
            .setY((60).percent())
            .setWidth((80).percent())
            .setHeight((2).pixel())
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
            .setChildOf(this.backgroundBox)

        // Centered to lines text
        this.text = new UIWrappedText(this.string)
            .setX((5).pixel())
            .setY((20).percent())
            .setWidth((70).percent())
            .setChildOf(this.backgroundBox)

        // Events handler
        this.backgroundBox
            .onMouseEnter((comp) => {
                if (this._triggerEvent(this.onMouseEnter) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        new ConstantColorConstraint(new ElementUtils.JavaColor(0, 0, 0, 80 / 255)),
                        0
                        )
                })
            })
            .onMouseLeave((comp) => {
                if (this._triggerEvent(this.onMouseLeave) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        new ConstantColorConstraint(new ElementUtils.JavaColor(0, 0, 0, 0)),
                        0
                        )
                })
            })
            .onMouseClick((comp) => {
                if (this._triggerEvent(this.onMouseClick) === 1) return
                
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.2,
                        new ConstantColorConstraint(new ElementUtils.JavaColor(1, 1, 1, 80 / 255)),
                        0
                        )
                    
                    animation.onComplete(() => {
                        comp.setColor(new ElementUtils.JavaColor(0, 0, 0, 0))
                    })
                })
            })
        return this.backgroundBox
    }
}