import { Animations, AspectConstraint, CenterConstraint, ConstantColorConstraint, CramSiblingConstraint, RelativeConstraint, UIRoundedRectangle, UIText, UIWrappedText, animate } from "../../Elementa"
import BaseElement from "./Base"
import TextElement from "./Text"

export default class SliderElement extends BaseElement {
    /**
     * @param {[Number, Number, Number]} settings [Min, Max, Starting Value]
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width The width in pixels
     * @param {Number} height 
     */
    constructor(settings = [ 1, 10, 2 ], x, y, width, height) {
        super(x, y, width, height, settings, null, "Slider")

        this.settings = settings

        this.initialPercent = settings[2] / settings[1]
        this.initialX = this.initialPercent !== 0 ? new RelativeConstraint(this.initialPercent) : this.x
        this.isDragging = false
        this.offset = 0
    }

    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        // TODO: fix the [sliderBox] going off bound of [sliderBar]
        // so it dosent let the user drag it back if it's at max [width/value]

        this.backgroundBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBar"))

        const [ x, y, width, height ] = [
            (1).pixel(),
            (1).pixel(),
            this.width,
            this.height
        ]

        this.textComponent = new TextElement("", true)
            .setString(this.getString())
            ._setPosition(x, y,)
            ._setSize(width, height)
            ._create(this.colorScheme)
            .setChildOf(this.backgroundBox)

        this.sliderBar = new UIRoundedRectangle(3)
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint())
            .setWidth(this.width)
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
        
        this.sliderValue = new UIText(this.settings[2])
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
        this.sliderBox
            .onMouseClick((component, event) => {
                this.isDragging = true
                this.offset = event.relativeX - (component.getWidth() / 2)
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
                // Makes the rounded number into an actual slider value
                this.value = parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

                this.sliderValue.setText(this.value)
                this.sliderBox.setX(new RelativeConstraint(percent))
                this.compBox.setWidth(new RelativeConstraint(percent))
            })
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

        this.sliderBar.onMouseClick((component, event) => {
            if (this._triggerEvent(this.onMouseClick) === 1) return

            const percent = event.relativeX / component.getWidth()
            this.value = parseInt((this.settings[1] - this.settings[0]) * ((percent * 100) / 100) + this.settings[0])

            this.sliderValue.setText(this.value)
            this.sliderBox.setX(new RelativeConstraint(percent))
            this.compBox.setWidth(new RelativeConstraint(percent))

            this.isDragging = true
        })

        return this.backgroundBox
    }
}