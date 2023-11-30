import { AspectConstraint, CenterConstraint, RelativeConstraint, UIRoundedRectangle, UIText } from "../../Elementa"
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
    constructor(settings = [ 1, 10, 2 ], x, y, width, height) {
        super(x, y, width, height)

        this.value = null
        this.settings = settings

        this.initialPercent = settings[2] / 10
        this.initialX = this.initialPercent !== 0 ? new RelativeConstraint(this.initialPercent) : this.x
        this.isDragging = false
        this.offset = 0
    }

    /**
     * - Gets the current slider's value
     * @returns {Number}
     */
    getValue() {
        return this.value
    }

    _create() {
        this.sliderBar = new UIRoundedRectangle(4)
            .setX(this.x)
            .setY(this.y)
            .setWidth((this.cleanValues.width).pixels())
            .setHeight((2).pixels())
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
        
        this.sliderBox = new UIRoundedRectangle(3)
            .setX(this.initialX)
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((9).pixels())
            .setChildOf(this.sliderBar)
        
        this.sliderValue = new UIText(this.settings[2])
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.sliderBox)

        this.compBox = new UIRoundedRectangle(3)
            .setWidth(new RelativeConstraint(this.initialPercent))
            .setHeight((100).percent())
            .setChildOf(this.sliderBar)

        // Slider events
        // Taking the same approach as [https://github.com/EssentialGG/Vigilance/blob/master/src/main/kotlin/gg/essential/vigilance/gui/settings/Slider.kt]
        // since the slider was flickering a lot with the previous code
        this.sliderBox
            .onMouseClick((component, event) => {
                this.isDragging = true
                this.offset = event.relativeX - (component.getWidth() / 2)
            })

            .onMouseRelease(() => {
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
                // Makes the rounded number into an actual slider value
                this.value = parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

                this.sliderValue.setText(this.value)
                this.sliderBox.setX(new RelativeConstraint(percent))
                this.compBox.setWidth(new RelativeConstraint(percent))
            })

        this.sliderBar.onMouseClick((component, event) => {
            if (this._triggerEvent(this.onMouseClick) === 1) return

            const percent = event.relativeX / component.getWidth()
            this.value = parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

            this.sliderValue.setText(this.value)
            this.sliderBox.setX(new RelativeConstraint(percent))
            this.compBox.setWidth(new RelativeConstraint(percent))

            this.isDragging = true
        })

        return this.sliderBar
    }
}