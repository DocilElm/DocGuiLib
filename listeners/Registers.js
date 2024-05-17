let i = 0
const CustomEventsENUM = {
    OPEN: i++,
    CLOSE: i++,
    DRAW: i++,
    MOUSECLICK: i++,
    MOUSERELEASE: i++,
    MOUSESCROLL: i++,
    MOUSEDRAG: i++,
    KEYTYPE: i++,
}

/**
 * - Handles the registers for the ct gui to trigger on the current window
 * @class
 */
export default class HandleRegisters {
    constructor(ctGui, window) {
        this.ctGui = ctGui
        this.window = window

        // Handles the gui's events
        this.eventsList = new Set()
        this.customEvents = new Map([
            [CustomEventsENUM.OPEN, []],
            [CustomEventsENUM.CLOSE, []],
            [CustomEventsENUM.DRAW, []],
            [CustomEventsENUM.MOUSECLICK, []],
            [CustomEventsENUM.MOUSERELEASE, []],
            [CustomEventsENUM.MOUSESCROLL, []],
            [CustomEventsENUM.MOUSEDRAG, []],
            [CustomEventsENUM.KEYTYPE, []],
        ])

        // Initialize every register
        this.init()
    }

    /**
     * - Create register events and push them to the list so we can delete them once we don't need them anymore
     */
    init() {
        this.eventsList.add(this.ctGui.registerDraw((mx, my, pticks) => {
            this.window.draw()
            
            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.DRAW)?.forEach(it => it(mx, my, pticks))
        }))

        this.eventsList.add(this.ctGui.registerClicked((mx, my, button) => {
            this.window.mouseClick(mx, my, button)

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.MOUSECLICK)?.forEach(it => it(mx, my, button))
        }))

        this.eventsList.add(this.ctGui.registerMouseReleased((mx, my, button) => {
            this.window.mouseRelease()

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.MOUSERELEASE)?.forEach(it => it(mx, my, button))
        }))

        this.eventsList.add(this.ctGui.registerScrolled((mx, my, scroll) => {
            this.window.mouseScroll(scroll)

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.MOUSESCROLL)?.forEach(it => it(mx, my, scroll))
        }))

        this.eventsList.add(this.ctGui.registerMouseDragged((mx, my, button) => {
            this.window.mouseDrag(mx, my, button)

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.MOUSEDRAG)?.forEach(it => it(mx, my, button))
        }))

        this.eventsList.add(this.ctGui.registerClosed((gui) => {
            this._stop()

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.CLOSE)?.forEach(it => it(gui))
        }))

        this.eventsList.add(this.ctGui.registerKeyTyped((keyChar, keyCode) => {
            this.window.keyType(keyChar, keyCode)

            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.KEYTYPE)?.forEach(it => it(keyChar, keyCode))
        }))

        this.eventsList.add(this.ctGui.registerOpened((gui) => {
            // Trigger the saved [customEvents]
            this.customEvents.get(CustomEventsENUM.OPEN)?.forEach(it => it(gui))
        }))
    }

    /**
     * - Triggers the given function whenever this [Gui] is opened
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onOpen(fn) {
        this.customEvents.get(CustomEventsENUM.OPEN)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function whenever this [Gui] is closed
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onClose(fn) {
        this.customEvents.get(CustomEventsENUM.CLOSE)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime this [Gui] is drawn
     * - Gives [mouseX, mouseY, partialTicks] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onDraw(fn) {
        this.customEvents.get(CustomEventsENUM.DRAW)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime there's a mouse click while this [Gui] is opened
     * - Gives [mouseX, mouseY, mouseButton] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onMouseClick(fn) {
        this.customEvents.get(CustomEventsENUM.MOUSECLICK)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime there's a mouse release while this [Gui] is opened
     * - Gives [mouseX, mouseY, mouseButton] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onMouseReleased(fn) {
        this.customEvents.get(CustomEventsENUM.MOUSERELEASE)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime there's a mouse scroll while this [Gui] is opened
     * - Gives [mouseX, mouseY, scrollDirection] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onMouseScroll(fn) {
        this.customEvents.get(CustomEventsENUM.MOUSESCROLL)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime there's a mouse drag while this [Gui] is opened
     * - Gives [mouseX, mouseY, mouseButton] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onMouseDrag(fn) {
        this.customEvents.get(CustomEventsENUM.MOUSEDRAG)?.push(fn)

        return this
    }

    /**
     * - Triggers the given function everytime there's a key type while this [Gui] is opened
     * - Gives [keyChar, keyCode] as params for the function
     * @param {Function} fn 
     * @returns this for method chaining
     */
    onKeyType(fn) {
        this.customEvents.get(CustomEventsENUM.KEYTYPE)?.push(fn)

        return this
    }

    /**
     * - Internal use
     * - Unregisters and deletes the list
     */
    _stop() {
        this.eventsList.forEach(event => event.unregister())
        this.eventsList.clear()
    }
}