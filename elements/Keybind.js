import { CenterConstraint, OutlineEffect, UIRoundedRectangle, UIWrappedText } from "../../Elementa"
import BaseElement from "./Base"

let keyEvents = []

const onKeyEvent = (fn) => keyEvents.push(fn)

register("guiKey", (char, keycode, gui, event) => keyEvents.forEach(it => it(char, keycode, gui, event)))

export default class KeybindElement extends BaseElement {
    constructor(keycode, x, y, width, height) {
        super(x, y, width, height, keycode, null, "Keybind")

        this.enabled = false
    }

    _create(colorScheme) {
        if (!this.colorScheme) this.setColorScheme(colorScheme)

        this.bgbox = new UIRoundedRectangle(this._getSchemeValue("background", "roundness"))
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getColor("background", "color"))
            .enableEffect(new OutlineEffect(this._getColor("background", "outlineColor"), this._getSchemeValue("background", "outlineSize")))

        this.keyText = new UIWrappedText(this._getKeyName(), true, null, true, true, 10)
            .setX((1).pixels())
            .setY((new CenterConstraint()))
            .setWidth((100).percent())
            .setColor(this._getColor("text", "color"))
            .setTextScale((this._getSchemeValue("text", "scale")).pixels())
            .setChildOf(this.bgbox)

        // Events
        this.bgbox
            .onMouseClick((comp, event) => {
                if (this.enabled) {
                    event.stopPropagation()
                    this.value = -100 + event.mouseButton

                    if (this._triggerEvent(this.onKeyType, this.getValue(), this._getKeyName()) === 1) return

                    this.enabled = false
                    this.keyText.setText(this._getKeyName())

                    return
                }

                if (event.mouseButton !== 0) return

                this.enabled = true
                this.keyText.setText(this._getSchemeValue("text", "enabled"))
            })
            .onFocusLost(() => this.enabled = false)

        // Handle it via custom event so we can actually cancel the event
        // since #stopPropagation does not work with key type events
        // and what we need is to cancel [ESC] from closing the main [GUI]
        onKeyEvent((char, keycode, _, event) => {
            if (!this.enabled) return

            if (keycode === Keyboard.KEY_ESCAPE) {
                cancel(event)
                keycode = 0
            }

            if (this._triggerEvent(this.onKeyType, keycode, char) === 1) return

            this.enabled = false
            this.value = keycode
            this.keyText.setText(this._getKeyName())
        })

        return this.bgbox
    }

    /**
     * - Internal use.
     * - Gets the string name of the current KeyCode
     * @returns {String}
     */
    _getKeyName() {
        if (this.getValue() < 0) return `M${Math.abs(-100 % this.getValue())}`

        const keyName = Keyboard.getKeyName(this.getValue())

        return keyName.length <= 3 ? `Key: ${keyName}` : keyName
    }

    setValue(value) {
        if (isNaN(value)) value = 0
        this.value = value

        this.keyText.setText(this._getKeyName())

        return this.value
    }
}