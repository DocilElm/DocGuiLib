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

        // Initialize every register
        this.init()
    }

    /**
     * - Create register events and push them to the list so we can delete them once we don't need them anymore
     */
    init() {
        this.eventsList.add(this.ctGui.registerDraw((_, __, ___) => {
            this.window.draw()
        }))

        this.eventsList.add(this.ctGui.registerClicked((mouseX, mouseY, button) => {
            this.window.mouseClick(mouseX, mouseY, button)
        }))

        this.eventsList.add(this.ctGui.registerMouseReleased((_, __, ___) => {
            this.window.mouseRelease()
        }))

        this.eventsList.add(this.ctGui.registerScrolled((_, __, scroll) => {
            this.window.mouseScroll(scroll)
        }))

        this.eventsList.add(this.ctGui.registerMouseDragged((mouseX, mouseY, button) => {
            this.window.mouseDrag(mouseX, mouseY, button)
        }))

        this.eventsList.add(this.ctGui.registerClosed((_) => {
            this._stop()
        }))

        this.eventsList.add(this.ctGui.registerKeyTyped((keyChar, keyCode) => {
            this.window.keyType(keyChar, keyCode)
        }))
    }

    /**
     * - Internal use
     * - Unregisters and deletes the list
     */
    _stop() {
        this.eventsList.forEach(event => {
            event.unregister()
            this.eventsList.delete(event)
        })

        this.eventsList.clear()
    }
}