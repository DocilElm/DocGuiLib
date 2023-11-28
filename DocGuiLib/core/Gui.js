import { Window } from "../../Elementa"
import HandleRegisters from "../listeners/Registers"

/**
 * - Handles the gui and it's components like buttons, ctGui, Window and all the events
 * @class
 */
export default class HandleGui {
    constructor() {
        this.ctGui = new Gui()
        this.window = new Window()

        this.registers = new HandleRegisters(this.ctGui, this.window)
    }

    /**
     * - Draws the given components on this window
     * @param {Array|Any} components 
     * @returns 
     */
    draw(components) {
        if (!(components instanceof Array)) return components._create().setChildOf(this.window)

        components.forEach(element => element._create().setChildOf(this.window))
    }

    /**
     * - Gets this element's window
     * @returns the window
     */
    getWindow() {
        return this.window
    }

    /**
     * - Sets the command to open this gui
     * @param {String} name 
     * @returns this for method chaining
     */
    setCommand(name) {
        register("command", () => this.ctGui.open()).setName(name)

        return this
    }
}