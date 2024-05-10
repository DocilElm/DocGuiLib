import { AspectConstraint, CenterConstraint, UIRoundedRectangle } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"
import TextInputElement from "./TextInput"

export default class ColorPickerElement extends BaseElement {
    constructor(string = "Placeholder", x, y, width, height) {
        super(x, y, width, height, string, null, "ColorPicker")

        this.currentRGB = null
        this.currentHex = null
    }

    /**
     * - Gets the current RGB value in text input and returns it
     * @returns {[Number, Number, Numer] | null}
     */
    getRGB() {
        return this.currentRGB
    }

    // This element will be taking the same approach as [https://github.com/Debuggingss/ClickGui/blob/master/src/main/kotlin/dev/debuggings/clickgui/elements/ColorPickerElement.kt]
    // since it's way easier than making a gradient and picking from there
    _create(colorScheme = {}) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        this.blockColor = new UIRoundedRectangle(3)

        this.textInput = new TextInputElement(ElementUtils.rgbToHex(this.getValue()))
            ._setPosition(this.x, this.y)
            ._setSize(this.width, this.height)
            .onKeyTypeEvent((text) => {
                let colors = ElementUtils.hexToRgb(text)

                if (!text) colors = [ 255, 255, 255, 255 ]

                if (!colors) return this.currentRGB = null
    
                this.currentHex = text
                this.currentRGB = colors

                const [ r, g, b, a ] = colors

                if (this._triggerEvent(this.onKeyType, [r, g, b, a]) === 1) return
    
                this.blockColor.setColor(
                    new ElementUtils.JavaColor(r / 255, g / 255, b / 255, a / 255)
                )
            })
            ._create(this.colorScheme, this.elementType)

        this.blockColor
            .setX((1).pixel(true))
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint(1))
            .setHeight((12).pixel())
            .setColor(ElementUtils.getJavaColor(this.getValue()))
            .setChildOf(this.textInput)

        return this.textInput
    }
}