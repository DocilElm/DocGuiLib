import { Animations, AspectConstraint, CenterConstraint, ConstantColorConstraint, OutlineEffect, RelativeConstraint, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class SliderElement extends BaseElement {
    /**
     * @param {[Number, Number, Number]} settings [Min, Max, Starting Value]
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width The width in pixels
     * @param {Number} height 
     */
    constructor(settings = [ 0, 10 ], defaultValue = 1, x, y, width, height, outline = false) {
        super(x, y, width, height, settings, null, "Slider", outline)

        this.settings = settings
        this.defaultValue = defaultValue

        this.initialPercent = this.defaultValue / this.settings[1]
        this.initialX = this.initialPercent !== 0 ? new RelativeConstraint(Math.min(this.initialPercent, 1 - 0.25)) : this.x
        this.isDragging = false
        this.offset = 0
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBar"))
            
        if (this.outline) this.backgroundBox.enableEffect(new OutlineEffect(ElementUtils.getJavaColor([255, 255, 255, 255]), 0.5))

        this.sliderBar = new UIRoundedRectangle(3)
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((98).percent())
            .setHeight((10).pixels())
            .setColor(this._getColor("sliderBox"))
            .setChildOf(this.backgroundBox)
        
        this.sliderBox = new UIRoundedRectangle(3)
            .setX(this.initialX)
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((15).pixels())
            .setColor(this._getColor("backgroundBox"))
            .setChildOf(this.sliderBar)
        
        this.sliderValue = new UIText(this.defaultValue)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("textScale").pixels()))
            .setColor(this._getColor("textColor"))
            .setChildOf(this.sliderBox)

        this.compBox = new UIRoundedRectangle(3)
            .setWidth(new RelativeConstraint(this.initialPercent))
            .setHeight((100).percent())
            .setColor(this._getColor("backgroundBox"))
            .setChildOf(this.sliderBar)

        // Slider events
        // Taking the same approach as [https://github.com/EssentialGG/Vigilance/blob/master/src/main/kotlin/gg/essential/vigilance/gui/settings/Slider.kt]
        // since the slider was flickering a lot with the previous code
        this.sliderBar
            .onMouseClick(() => {
                this.isDragging = true
                this.offset = 1
            })
            .onMouseRelease(() => {
                if (this._triggerEvent(this.onMouseRelease, this.getValue()) === 1) return

                this.isDragging = false
                this.offset = 0
            })
            .onMouseDrag((component, x, y, button) => {
                if (!this.isDragging) return

                // Cancel the custom event for this component
                if (this._triggerEvent(this.onMouseDrag, x, y, button, component) === 1 || !this.offset) return

                const clamped = (x + component.getLeft()) - this.offset
                // Rounds the number if it's above max it returns max value
                // if it's below min it reutnrs min value
                const roundNumber = Math.min(Math.max(clamped, this.sliderBar.getLeft()), this.sliderBar.getRight())
                // Makes the round number a percent basing it off of the parent
                const percent = (roundNumber - this.sliderBar.getLeft()) / this.sliderBar.getWidth()

                // Fix [sliderBox] going off bound
                const roundNumberBox = Math.min(Math.max(clamped, this.sliderBar.getLeft()), this.sliderBar.getRight() - this.sliderBox.getWidth())
                const sliderBoxPercent = (roundNumberBox - this.sliderBar.getLeft()) / this.sliderBar.getWidth()

                // Makes the rounded number into an actual slider value
                this.value = this.settings[0] % 1 !== 0
                    ? ((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0]).toFixed(2)
                    : parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

                this.sliderValue.setText(this.value)
                this.sliderBox.setX(new RelativeConstraint(sliderBoxPercent))
                this.compBox.setWidth(new RelativeConstraint(percent))
            })

        this.sliderBox
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        new ConstantColorConstraint(this._getColor("mouseEnter")),
                        0
                        )
                })
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations.OUT_EXP,
                        0.5,
                        new ConstantColorConstraint(this._getColor("mouseLeave")),
                        0
                        )
                })
            })

        return this.backgroundBox
    }
}