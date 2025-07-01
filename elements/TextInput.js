import { Animations, CenterConstraint, ConstantColorConstraint, FillConstraint, OutlineEffect, UIRoundedRectangle, UIText, UITextInput, animate } from "../../Elementa"
import BaseElement from "./Base"

let ticksDown = 0
let keybindEvents = []

register("tick", () => {
    if (!World.isLoaded() || !Keyboard.isKeyDown(Keyboard.KEY_BACK)) return ticksDown = 0

    ticksDown++
    if (ticksDown <= 10) return

    keybindEvents.forEach(it => it("", Keyboard.KEY_BACK))
})

export default class TextInputElement extends BaseElement {
    /**
     * @param {String} string The placeholder text
     * @param {Number} x This component's x value (default in percent)
     * @param {Number} y This component's y value (default in percent)
     * @param {Number} width This component's width value in pixels
     * @param {Number} height This component's height value in pixels
     */
    constructor(string = "Placeholder", x = 0, y = 0, width = 150, height = 8) {
        super(x, y, width, height, string, null, "TextInput")

        this.text = null
        this.placeHolder = null
        this.textSet = false
        this._customKeyEvent = true
    }

    setUseCustomKeyEvent(bool) {
        this._customKeyEvent = bool

        return this
    }

    /**
     * - Sets the placeholder for this textinput
     * @param {String} str 
     * @returns this for method chaining
     */
    setPlaceHolder(str) {
        if (!str) return this
        this.placeHolder = str

        return this
    }

    /**
     * - Gets the current text in this component
     * @returns {String}
     */
    getText() {
        return this.text
    }

    /**
     * - Creates this [TextInputElement] component and returns it
     * @returns {TextInputElement}
     */
    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)
        if (elementType) this.elementType = elementType

        this.bgBox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.textInput = new UITextInput(this.getValue() ?? "", true)
            .setX((this._getSchemeValue("text", "padding")).percent())
            .setY(new CenterConstraint())
            .setWidth(new FillConstraint(useSiblings = false))
            .setHeight((10).pixels())
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setColor(this._getColor("text", "color"))
            .setChildOf(this.bgBox)

        if (this.placeHolder) {
            this.placeholderText = new UIText(this.placeHolder)
                .setX((0).pixels())
                .setY(new CenterConstraint())
                .setColor(this._getColor("text", "placeholderColor"))
                .setChildOf(this.textInput)
        }

        if (this.getValue()) this.placeholderText?.hide(true)

        if (this._customKeyEvent) keybindEvents.push((keyChar, keyCode) => {
            if (!this.textInput.hasFocus()) return

            this.textInput.keyType(keyChar, keyCode)
        })

        this.textInput
            .onFocusLost(() => {
                if (this.text) return

                this.placeholderText?.unhide(true)
            })
            .onMouseClick((component, __) => {
                if (this._triggerEvent(this.onMouseClick, component) === 1) return

                if (!this.textSet) {
                    component.setText(this.getValue())
                    this.text = this.getValue()
                    this.textSet = true
                }
                
                component.grabWindowFocus()
                component.focus()
            })
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

                if (!this.placeholderText) return

                animate(this.placeholderText, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseEnterAnimation", "type")],
                        this._getSchemeValue("mouseEnterAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseEnterAnimation", "placeholderColor")),
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

                if (!this.placeholderText) return

                animate(this.placeholderText, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseLeaveAnimation", "type")],
                        this._getSchemeValue("mouseLeaveAnimation", "time"),
                        new ConstantColorConstraint(this._getColor("mouseLeaveAnimation", "placeholderColor")),
                        0
                        )
                })
            })
            .onKeyType((input, char, keycode) => {
                if (this._triggerEvent(this.onKeyType, input.getText(), char, keycode) === 1) return

                this.text = input.getText()
                
                if (!this.placeholderText) return

                if (this.text === "") {
                    this.textInput.placeholder = ""
                    this.placeholderText.unhide(true)

                    return
                }

                this.placeholderText.hide(true)
            })

        return this.bgBox
    }

    setValue(value) {
        if (typeof value !== "string") value = ""
        this.value = value

        this.textInput.setText(this.value)
        if (this.placeHolder && this.value !== "") this.placeholderText.hide(true)

        return this.value
    }
}