import { Animations, ConstantColorConstraint, UIRoundedRectangle, UIText, UITextInput, animate } from "../../Elementa"
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
        // Only used by public methods [#unhidePlaceHolder/#hidePlaceHolder]
        this.placeHolderHidden = false
    }

    /**
     * - Sets the placeholder for this textinput
     * @param {String} str 
     * @returns this for method chaining
     */
    setPlaceHolder(str) {
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

        this.bgBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("backgroundBox"))

        this.textInput = new UITextInput("")
            .setX((3).pixels())
            .setY((1).pixels())
            .setWidth((80).percent())
            .setHeight((80).percent())
            .setTextScale((this._getSchemeValue("textScale")).pixels())
            .setColor(this._getColor("textColor"))
            .setChildOf(this.bgBox)

        if (this.placeHolder) {
            this.placeholderText = new UIText(this.placeHolder)
                .setX((1).pixels())
                .setY((1).pixels())
                .setChildOf(this.textInput)
        }

        keybindEvents.push((keyChar, keyCode) => {
            if (!this.textInput.hasFocus()) return

            this.textInput.keyType(keyChar, keyCode)
        })

        this.textInput
            .onFocus(() => {
                this.placeholderText?.hide(true)
                this.placeHolderHidden = true
            })
            .onFocusLost(() => {
                if (this.text) return

                this.placeholderText?.unhide(true)
                this.placeHolderHidden = false
            })
            .onMouseClick((component, __) => {
                if (this._triggerEvent(this.onMouseClick, component) === 1) return

                if (!component.getText()) {
                    component.setText(this.getValue())
                    this.text = this.getValue()
                }
                
                component.grabWindowFocus()
                component.focus()
                if (this.placeholderText) {
                    this.placeholderText.hide(true)
                    this.placeHolderHidden = true
                }
            })
            .onMouseEnter((comp, event) => {
                if (this._triggerEvent(this.onMouseEnter, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseAnimation")],
                        this._getSchemeValue("animationTime"),
                        new ConstantColorConstraint(this._getColor("mouseEnter")),
                        0
                        )
                })
            })
            .onMouseLeave((comp, event) => {
                if (this._triggerEvent(this.onMouseLeave, comp, event) === 1) return
            
                animate(comp, (animation) => {
                    animation.setColorAnimation(
                        Animations[this._getSchemeValue("mouseAnimation")],
                        this._getSchemeValue("animationTime"),
                        new ConstantColorConstraint(this._getColor("mouseLeave")),
                        0
                        )
                })
            })
            .onKeyType((input, char, keycode) => {
                if (this._triggerEvent(this.onKeyType, input.getText(), char, keycode) === 1) return

                this.text = input.getText()
                
                if (this.placeholderText && input.getText() == "") {
                    this.placeholderText.unhide(true)
                    this.placeHolderHidden = false
                }
                
                if (this.placeholderText) {
                    this.placeholderText.hide(true)
                    this.placeHolderHidden = true
                }
            })

        if (this.placeholderText) {
            this.placeholderText
                .onMouseEnter((comp, event) => {
                    if (this._triggerEvent(this.onMouseEnter, comp, event) === 1) return
                
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations[this._getSchemeValue("mouseAnimation")],
                            this._getSchemeValue("animationTime"),
                            new ConstantColorConstraint(this._getColor("mouseEnter")),
                            0
                            )
                    })
                })
                .onMouseLeave((comp, event) => {
                    if (this._triggerEvent(this.onMouseLeave, comp, event) === 1) return
                
                    animate(comp, (animation) => {
                        animation.setColorAnimation(
                            Animations[this._getSchemeValue("mouseAnimation")],
                            this._getSchemeValue("animationTime"),
                            new ConstantColorConstraint(this._getColor("mouseLeave")),
                            0
                            )
                    })
                })
        }

        return this.bgBox
    }

    /**
     * - Hides the place holder text for this [TextInput]
     * - If the placeholder has already been hidden it won't attempt to hide it again
     * @returns this for method chaining
     */
    hidePlaceHolder() {
        if (!this.placeHolder || this.placeHolderHidden) return this

        this.placeholderText.hide(true)
        this.placeHolderHidden = true

        return this
    }

    /**
     * - Unhides the place holder text for this [TextInput]
     * - If the placeholder has already been unhidden it won't attempt to unhide it again
     * @returns this for method chaining
     */
    unhidePlaceHolder() {
        if (!this.placeHolder || !this.placeHolderHidden) return this

        this.placeholderText.unhide(true)
        this.placeHolderHidden = false

        return this
    }
}