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
        this.defaultValue = ElementUtils.miniMax(this.settings[0], this.settings[1], defaultValue)
        // Used to check whether the previously saved value was over/under the min/max
        this.rawDefaultValue = defaultValue

        this.initialPercent = ElementUtils.miniMax(0, 1, this.defaultValue / this.settings[1])
        this.initialX = this.initialPercent !== 0 ? new RelativeConstraint(ElementUtils.miniMax(0, 0.75, this.initialPercent)) : this.x
        this.isDragging = false
        this.offset = 0

        // Check for decimal pointers and if they should be there add them
        if (this.settings[0] % 1 !== 0) this.defaultValue = this.defaultValue.toFixed(2)
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        // If the previously saved default value was under/over the min/max
        // we call the [onMouseRelease] event so it gets adjusted to the new value
        if (this.rawDefaultValue < this.settings[0] || this.rawDefaultValue > this.settings[1]) {
            this._triggerEvent(this.onMouseRelease, this.defaultValue)
        }

        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))
            .enableEffect(new OutlineEffect(this._getColor("outlineColor"), this._getSchemeValue("outlineThickness")))

        this.sliderBar = new UIRoundedRectangle(3)
            .setX((1).pixels())
            .setY(new CenterConstraint())
            .setWidth((98).percent())
            .setHeight((10).pixels())
            .setColor(this._getColor("disabledBar"))
            .enableEffect(new OutlineEffect(this._getColor("sliderBarOutlineColor"), this._getSchemeValue("sliderBarOutlineThickness")))
            .setChildOf(this.backgroundBox)

        this.compBox = new UIRoundedRectangle(3)
            .setWidth(new RelativeConstraint(this.initialPercent))
            .setHeight((100).percent())
            .setColor(this._getColor("enabledBar"))
            .setChildOf(this.sliderBar)
        
        this.sliderBox = new UIRoundedRectangle(3)
            .setX(this.initialX)
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((15).pixels())
            .setColor(this._getColor("sliderBox"))
            .enableEffect(new OutlineEffect(this._getColor("sliderBoxOutlineColor"), this._getSchemeValue("sliderBoxOutlineThickness")))
            .setChildOf(this.sliderBar)
        
        this.sliderValue = new UIText(this.defaultValue)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("textScale").pixels()))
            .setColor(this._getColor("textColor"))
            .setChildOf(this.sliderBox)

        // Slider events
        // Taking the same approach as [https://github.com/EssentialGG/Vigilance/blob/master/src/main/kotlin/gg/essential/vigilance/gui/settings/Slider.kt]
        // since the slider was flickering a lot with the previous code
        this.sliderBar
            .onMouseClick(this._onMouseClick.bind(this))
            .onMouseRelease(this._onMouseRelease.bind(this))
            .onMouseDrag(this._onMouseDrag.bind(this))

        this.backgroundBox
            .onMouseClick(this._onMouseClick.bind(this))
            .onMouseRelease(this._onMouseRelease.bind(this))
            .onMouseDrag(this._onMouseDrag.bind(this))

        this.sliderBox
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseAnimation")],
                        this._getSchemeValue("animationTime"),
                        new ConstantColorConstraint(this._getColor("mouseEnter")),
                        0
                        )
                })
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseAnimation")],
                        this._getSchemeValue("animationTime"),
                        new ConstantColorConstraint(this._getColor("mouseLeave")),
                        0
                        )
                })
            })

        return this.backgroundBox
    }

    _onMouseClick(component, event) {
        if (this._triggerEvent(this.onMouseClick, component, event) === 1) return

        this.isDragging = true
        this.offset = 1
    }

    _onMouseRelease() {
        if (this._triggerEvent(this.onMouseRelease, this.getValue()) === 1) return

        this.isDragging = false
        this.offset = 0
    }

    _onMouseDrag(component, x, y, button) {
        if (!this.isDragging) return

        // Cancel the custom event for this component
        if (this._triggerEvent(this.onMouseDrag, x, y, button, component, this.getValue()) === 1 || !this.offset) return
        
        const clamped = (x + component.getLeft()) - this.offset
        const roundNumber = ElementUtils.miniMax(this.sliderBar.getLeft(), this.sliderBar.getRight(), clamped)
        const percent = ElementUtils.miniMax(0, 1, (roundNumber - this.sliderBar.getLeft()) / this.sliderBar.getWidth())

        // Fix [sliderBox] going off bound
        const roundNumberBox = ElementUtils.miniMax(this.sliderBar.getLeft(), this.sliderBar.getRight() - this.sliderBox.getWidth(), clamped)
        const sliderBoxPercent = ElementUtils.miniMax(0, 1, (roundNumberBox - this.sliderBar.getLeft()) / this.sliderBar.getWidth())

        // Makes the rounded number into an actual slider value
        this.value = this.settings[0] % 1 !== 0
            ? ((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0]).toFixed(2)
            : parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

        this.sliderValue.setText(this.value)
        this.sliderBox.setX(new RelativeConstraint(sliderBoxPercent))
        this.compBox.setWidth(new RelativeConstraint(percent))
    }
}