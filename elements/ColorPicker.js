import { Animations, CenterConstraint, CramSiblingConstraint, GradientComponent, OutlineEffect, RelativeConstraint, UIBlock, UIContainer, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"
import SliderElement from "./Slider"
import TextInputElement from "./TextInput"

const UMatrixStack = Java.type("gg.essential.universal.UMatrixStack")
const UGraphics = Java.type("gg.essential.universal.UGraphics")
const Color = Java.type("java.awt.Color")
const hueColors = new Array(50).fill(null).map((_, idx) => new Color(Color.HSBtoRGB(idx / 50, 1, 0.7)))

/**
 * - Gets a number that's between the given min and the given max
 * - without letting the value go under min or over max
 * @param {Number} min 
 * @param {Number} max 
 * @param {Number} value 
 * @returns {Number}
 */
const minMax = (min, max, value) => Math.min(Math.max(value, min), max)

function UICustomGradient(color1) {
    return new JavaAdapter(GradientComponent, {
      draw() {
        // Got too lazy to figure this out so
        // now that's here
        if (this.getStartColor().getRGB() === -1 && this.getEndColor().getRGB() === -1) {
            this.setStartColor(color1)
            this.setEndColor(new Color(0, 0, 0))
        }

        UGraphics.enableBlend()
        UGraphics.disableAlpha()
        UGraphics.tryBlendFuncSeparate(770, 771, 1, 0)
        UGraphics.shadeModel(7425)

        const tessellator = UGraphics.getFromTessellator()
        const matrixStack = UMatrixStack.UNIT

        const [ x1, y1, x2, y2 ] = [ this.getLeft(), this.getTop(), this.getRight(), this.getBottom() ]
        const [ topRight, topLeft, bottomLeft, bottomRight ] = [
            this.getStartColor(), new Color(1, 1, 1),
            this.getEndColor(), this.getEndColor()
        ]

        tessellator.beginWithDefaultShader(UGraphics.DrawMode.QUADS, UGraphics.CommonVertexFormats.POSITION_COLOR)
        tessellator.pos(matrixStack, x1, y2, 0.0).color(bottomLeft).endVertex()
        tessellator.pos(matrixStack, x2, y2, 0.0).color(bottomRight).endVertex()
        tessellator.pos(matrixStack, x1, y1, 0.0).color(topLeft).endVertex()
        tessellator.pos(matrixStack, x2, y1, 0.0).color(topRight).endVertex()
        tessellator.pos(matrixStack, x2, y1, 0.0).color(topRight).endVertex()
        tessellator.pos(matrixStack, x1, y1, 0.0).color(topLeft).endVertex()
        tessellator.pos(matrixStack, x2, y2, 0.0).color(bottomRight).endVertex()
        tessellator.pos(matrixStack, x1, y2, 0.0).color(bottomLeft).endVertex()
        tessellator.drawDirect()

        UGraphics.shadeModel(7424)
        UGraphics.disableBlend()
        UGraphics.enableAlpha()
      },
    })
}

function UICustomBlock() {
    return new JavaAdapter(UIBlock, {
        draw() {
            for (let idx = 0; idx < hueColors.length; idx++) {
                let color = hueColors[idx]
                let yPos = this.getTop() + ((idx * this.getHeight()) / 50)

                Renderer.drawRect(color.getRGB(), this.getLeft(), yPos, 10, 2)
            }
        }
    })
}

export default class ColorPickerElement extends BaseElement {
    constructor(string = "Placeholder", x, y, width, height) {
        super(x, y, width, height, string, null, "ColorPicker")

        this.currentRGB = null
        this.currentHex = null

        // Color variables
        this.defaultColor = new Color(this.getValue()[0] / 255, this.getValue()[1] / 255, this.getValue()[2] / 255, (this.getValue()?.[3] ?? 255) / 255)
        this.hsb = Color.RGBtoHSB(this.defaultColor.getRed(), this.defaultColor.getGreen(), this.defaultColor.getBlue(), null)
        this.currentHue = this.hsb[0]
        this.currentSaturation = this.hsb[1]
        this.currentBrightness = this.hsb[2]
        this.currentAlpha = this.defaultColor.getAlpha() / 255

        // Components variables
        this.draggingHue = false
        this.draggingPicker = false
        this.hidden = true
        this.parentHeight = null
        this.firstExpandHeight = null

        this._shouldResizeParent = true
    }

    /**
     * - Gets the current RGB value in text input and returns it
     * @returns {[Number, Number, Numer] | null}
     */
    getRGB() {
        return this.currentRGB
    }

    /**
     * - Whether the hide/unhide logic should re-size the parent of this component
     * - it makes the parent component the height of the color picker background box height
     * - this is to ensure that it can fit the component properly
     * @param {Boolean} bool `true` by default
     * @returns this for method chaining
     */
    shouldResizeParent(bool) {
        this._shouldResizeParent = bool

        return this
    }

    // This element will be taking the same approach as [https://github.com/EssentialGG/Vigilance/blob/master/src/main/kotlin/gg/essential/vigilance/gui/settings/ColorPicker.kt]
    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        this.generalBg = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setColor(this._getColor("generalBackgroundBox"))
            .setWidth((30).percent())
            .setHeight((98).percent())

        this.textInput = new TextInputElement(ElementUtils.rgbToHex(this.getValue()))
            .setPlaceHolder(ElementUtils.rgbToHex(this.getValue()))
            ._setPosition(
                new CenterConstraint(),
                new CenterConstraint()
                )
            ._setSize(
                (70).percent(),
                (15).pixels()
            )
            
        this.textInput
            ._create(this.colorScheme, this.elementType)
            .setChildOf(this.generalBg)

        this.arrowText = new UIText(this._getSchemeValue("hideArrowText"))
            .setX(new CramSiblingConstraint(5))
            .setY(new CenterConstraint())
            .setTextScale((this._getSchemeValue("arrowTextScale")).pixels())
            .setChildOf(this.generalBg)

        this.bgBox = new UIRoundedRectangle(3)
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint(5))
            .setWidth((80).percent())
            .setHeight((65).percent())
            .setColor(this._getColor("colorPickerBackgroundBox"))
            .enableEffect(new OutlineEffect(this._getColor("colorPickerBackgroundBoxOutlineColor"), this._getSchemeValue("colorPickerBackgroundBoxOutlineThickness")))
            .setChildOf(this.generalBg)

        this.gradient = new UICustomGradient(new Color(Color.HSBtoRGB(this.currentHue, 1, 1)))
            .setX((5).percent())
            .setY((1).percent())
            .setWidth((70).percent())
            .setHeight((65).percent())
            .setChildOf(this.bgBox)

        this.fakeGradient = new UIRoundedRectangle(3)
            .setX((5).percent())
            .setY((1).percent())
            .setWidth((70).percent())
            .setHeight((65).percent())
            .setColor(ElementUtils.getJavaColor([0, 0, 0, 0]))
            .enableEffect(new OutlineEffect(this._getColor("gradientBackgroundBoxOutlineColor"), this._getSchemeValue("gradientBackgroundBoxOutlineThickness")))
            .setChildOf(this.bgBox)

        this.gradientPointer = new UIContainer()
            .setX(new RelativeConstraint(minMax(0, 0.96, this.currentSaturation)))
            .setY(new RelativeConstraint(minMax(0, 0.96, 1 - this.currentBrightness)))
            .setWidth((3).pixels())
            .setHeight((3).pixels())
            .enableEffect(new OutlineEffect(this._getColor("gradientPointerOutlineColor"), this._getSchemeValue("gradientPointerOutlineThickness")))
            .setChildOf(this.fakeGradient)

        this.genHueBg = new UIBlock(ElementUtils.getJavaColor([0, 0, 0, 0]))
            .setX(new CramSiblingConstraint(5))
            .setY((1).percent())
            .setWidth((15).pixels())
            .setHeight((60).percent())
            .setChildOf(this.bgBox)

        // Had to do this for precision
        // technically just a decoration so the user can see it at the correct length
        this.hueLineBg = new UICustomBlock()
            .setX((1).pixels())
            .setY((1).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .setChildOf(this.genHueBg)

        this.fakeHueLine = new UIBlock(ElementUtils.getJavaColor([0, 0, 0, 0]))
            .setX((1).pixels())
            .setY((1).pixels())
            .setWidth((68).percent())
            .setHeight((100).percent())
            .enableEffect(new OutlineEffect(this._getColor("hueBackgroundBoxOutlineColor"), this._getSchemeValue("hueBackgroundBoxOutlineThickness")))
            .setChildOf(this.genHueBg)

        this.huePointer = new UIContainer()
            .setX((0).pixels())
            .setY(new RelativeConstraint(this.currentHue))
            .setWidth((100).percent())
            .setHeight((3).percent())
            .enableEffect(new OutlineEffect(this._getColor("huePointerOutlineColor"), this._getSchemeValue("huePointerOutlineThickness")))
            .setChildOf(this.fakeHueLine)

        this.alphaSlider = new SliderElement([0.1, 1], parseFloat(this.currentAlpha.toFixed(2)))
            ._setPosition(
                (5).percent(),
                (80).percent()
            )
            ._setSize(
                (70).percent(),
                (3).percent()
            )

        this.alphaSlider
            ._create(this.colorScheme)
            .setChildOf(this.bgBox)


        // Events
        // Arrow text events
        this.arrowText.onMouseClick((comp) => {
            if (this.hidden) return this.unhideColorPicker(comp)

            this.hideColorPicker(comp)
        })

        // Textinput (hex input)
        // TODO: add alpha support to hex
        this.textInput.onKeyTypeEvent((text) => {
            if (text.length !== 6) return

            let colors = ElementUtils.hexToRgb(text)

            if (!colors) return this.currentRGB = null

            this.currentHex = text
            this.currentRGB = colors

            const [ r, g, b ] = colors

            if (this._triggerEvent(this.onKeyType, [r, g, b, Math.floor(this.currentAlpha * 255)]) === 1) return

            const hsb = Color.RGBtoHSB(r, g, b, null)
            this.currentHue = hsb[0]
            this.currentSaturation = hsb[1]
            this.currentBrightness = hsb[2]

            this.huePointer.setY(new RelativeConstraint(minMax(0, 1, this.currentHue)))
            this.gradientPointer
                .setX(new RelativeConstraint(minMax(0, 0.96, this.currentSaturation)))
                .setY(new RelativeConstraint(minMax(0, 0.96, 1 - this.currentBrightness)))
            this.updateColor(true)
        })

        // Fake gradient
        this.fakeGradient
            .onMouseClick((comp, event) => {
                this.draggingPicker = true

                this.currentSaturation = event.relativeX / comp.getWidth()
                this.currentBrightness = 1 - (event.relativeY / comp.getHeight())

                this.gradientPointer
                    .setX(new RelativeConstraint(minMax(0, 0.94, this.currentSaturation)))
                    .setY(new RelativeConstraint(minMax(0, 1, 1 - this.currentBrightness)))

                this.updateColor()
            })
            .onMouseDrag((comp, x, y) => {
                if (!this.draggingPicker) return

                this.currentSaturation = minMax(0, 1, x / comp.getWidth())
                this.currentBrightness = minMax(0, 1, 1 - (y / comp.getHeight()))

                this.gradientPointer
                    .setX(new RelativeConstraint(minMax(0, 0.94, this.currentSaturation)))
                    .setY(new RelativeConstraint(minMax(0, 0.9, 1 - this.currentBrightness)))

                this.updateColor()
            })
            .onMouseRelease(() => this.draggingPicker = false)

        // Fake hue line
        this.fakeHueLine
            .onMouseClick((comp, event) => {
                this.draggingHue = true
                this.currentHue = minMax(0, 1, (event.relativeY - 1) / comp.getHeight())
                this.huePointer.setY(new RelativeConstraint(minMax(0, 1, this.currentHue)))
                this.updateColor()
            })
            .onMouseDrag((comp, x, y) => {
                if (!this.draggingHue) return
            
                this.currentHue = minMax(0, 1, (y - 1) / comp.getHeight())
                this.huePointer.setY(new RelativeConstraint(minMax(0, 1, this.currentHue)))
                
                this.updateColor()
            })
            .onMouseRelease(() => this.draggingHue = false)

        // Alpha slider
        this.alphaSlider.onMouseReleaseEvent((value) => {
            if (!this.alphaSlider.isDragging) return

            this.currentAlpha = parseFloat(value)
            this._triggerKeyEvent()
        })

        // Background box click
        this.bgBox.onMouseClick((comp, event) => {
            const [ left, top, right, bottom ] = [ this.alphaSlider.sliderBar.getLeft(), this.alphaSlider.sliderBar.getTop(), this.alphaSlider.sliderBar.getRight(), this.alphaSlider.sliderBar.getBottom() ]

            // Detect whether the position clicked is in the boundaries of the slider
            // this is to ensure that the user can have a good user experience while changing alpha
            if (!(event.absoluteX >= left && event.absoluteX <= right && event.absoluteY >= top && event.absoluteY <= bottom)) return

            this.alphaSlider._onMouseClick(comp, event)
        })

        // Hide color picker by default
        this.bgBox.hide(true)

        return this.generalBg
    }

    updateColor(internal = false) {
        this.defaultColor = new Color(Color.HSBtoRGB(this.currentHue, this.currentSaturation, this.currentBrightness))
        this.gradient.setStartColor(new Color(Color.HSBtoRGB(this.currentHue, 1, 1)))

        this._triggerKeyEvent()

        if (internal) return

        this.textInput.hidePlaceHolder()
        this.textInput.textInput.setText(ElementUtils.rgbToHex([
            this.defaultColor.getRed(),
            this.defaultColor.getGreen(),
            this.defaultColor.getBlue()
        ]))
    }

    /**
     * - Hides the Arrow Text component and re-sizes the parent (this is going to be optional soon)
     * @param {UIText} comp THe text (arrow) component
     */
    hideColorPicker(comp) {
        comp.setText(this._getSchemeValue("hideArrowText"))

        if (!this._shouldResizeParent) {
            this.hidden = true
            this.bgBox.hide(true)

            return
        }

        animate(this.generalBg, (animation) => {
            animation.setHeightAnimation(
                Animations[this._getSchemeValue("heightAnimationOut")],
                this._getSchemeValue("heightAnimationOutTime"),
                (this.parentHeight).pixels()
                )
            animation.onComplete(() => {
                this.generalBg.parent.setHeight((this.parentHeight).pixels())
                this.textInput.bgBox.setY(new CenterConstraint())
                comp.setY(new CenterConstraint())
                    
                this.hidden = true
                this.bgBox.hide(true)
            })
        })
    }
    
    /**
     * - Unhides the Arrow Text component and re-sizes the parent (this is going to be optional soon)
     * @param {UIText} comp The text (arrow) component
     */
    unhideColorPicker(comp) {
        comp.setText(this._getSchemeValue("unhideArrowText"))

        this.hidden = false
        this.bgBox.unhide(true)

        if (!this._shouldResizeParent) return

        // Set the parent height to be used once we hide this element
        this.parentHeight = this.generalBg.parent.getHeight()

        const height = this.firstExpandHeight ?? (this.generalBg.getHeight() + this.textInput.bgBox.getHeight() + this.bgBox.getHeight()).pixels()

        animate(this.generalBg, (animation) => {
            animation.setHeightAnimation(
                Animations[this._getSchemeValue("heightAnimationIn")],
                this._getSchemeValue("heightAnimationInTime"),
                height
                )
        })

        if (!this.firstExpandHeight) this.firstExpandHeight = height

        this.textInput.bgBox.setY((1).pixels())
        comp.setY((1).pixels())
        this.generalBg.parent.setHeight(height)
    }

    // im too lazy to change the other systems for now
    // so im just going to trigger key event for every color/alpha change
    _triggerKeyEvent() {
        this._triggerEvent(this.onKeyType, [
            this.defaultColor.getRed(),
            this.defaultColor.getGreen(),
            this.defaultColor.getBlue(),
            Math.floor(this.currentAlpha * 255)
        ])
    }
}