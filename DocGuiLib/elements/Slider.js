import { AspectConstraint, CenterConstraint, RelativeConstraint, UIRoundedRectangle, UIText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class SliderElement extends BaseElement {
    /**
     * @param {String} string 
     * @param {[Number, Number, Number]} settings Min value, max value, default value
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     */
    constructor(string = "Placeholder", settings = [ 1, 10, 2 ], x, y, width, height) {
        super(x, y, width, height)

        this.string = string
        this.value = null
        this.settings = settings

        this.isDragging = false
        this.steps = parseInt((this.cleanValues.width / settings[1]) - 1)

        this.grabOffset = null
        this.grabAmount = 0

        // Handlers
        this.onMouseDrag = null
        this.shouldCancel = false
    }

    /**
     * - Gets the current slider's value
     * @returns {Number}
     */
    getValue() {
        return this.value
    }

    /**
     * - The function to trigger whenever this component is dragged (returns [mouseX, mouseY, button, component])
     * @param {Function} fn 
     * @param {boolean} shouldCancel Whether to cancel this component's custom event for onMouseDrag
     * @returns this for method chaining
     */
    addOnMouseDragEvent(fn, shouldCancel = false) {
        this.onMouseDrag = fn
        this.shouldCancel = shouldCancel

        return this
    }

    _create() {
        this.sliderBar = new UIRoundedRectangle(4)
            .setX(this.x)
            .setY(this.y)
            .setWidth((this.cleanValues.width).pixels())
            .setHeight((2).pixels())
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))
        
        this.sliderBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((9).pixels())
            .setChildOf(this.sliderBar)
        
        this.sliderValue = new UIText("0")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.sliderBox)

        this.compBox = new UIRoundedRectangle(3)
            .setWidth(new RelativeConstraint(0))
            .setHeight((100).percent())
            .setChildOf(this.sliderBar)

        // Slider events
        this.sliderBox
            .onMouseClick(() => {
                this.isDragging = true
                this.grabAmount++
            })

            .onMouseRelease(() => {
                this.isDragging = false
                this.grabAmount = 0
            })

            .onMouseDrag((component, x, y, button) => {
                if (!this.isDragging) return

                if (this.onMouseDrag) this.onMouseDrag(x, y, button, component)

                // Cancel the custom event for this component
                if (this.shouldCancel) return
                
                const mouseX = parseInt(Math.min(Math.max(x, this.settings[0]), this.cleanValues.width))
                this.value = parseInt(MathLib.map(mouseX, 0, this.cleanValues.width, this.settings[0], this.settings[1]))

                this.sliderValue.setText(this.value)
                this.sliderBox.setX((this.steps * this.value).pixels())
                this.compBox.setWidth((this.steps * this.value).pixels())
            })
        return this.sliderBar
    }
}