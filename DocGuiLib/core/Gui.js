import { Window } from "../../Elementa"
import HandleRegisters from "../listeners/Registers"

/**
 * - Handles the gui and it's components like buttons, ctGui, Window and all the events
 * @class
 */
export default class HandleGui {
    /**
     * - Creates a new [HandleGui] with the given params
     * @param {String} filePath The default color scheme file path
     * @param {String} moduleName This module's name
     * - Please add your module's name because if you don't it'll default to this lib module
     * name and it'll cause other modules to be able to change your color scheme if they'd like to
     * obviously they can still do it but this is a little bit safer way to going about it
     * and also to avoid over writing other's file
     */
    constructor(filePath = "data/DefaultColors.json", moduleName = "DocGuiLib") {
        this.ctGui = new Gui()
        this.window = new Window()
        this.registers = new HandleRegisters(this.ctGui, this.window)

        this.moduleName = moduleName

        this.colorScheme = JSON.parse(FileLib.read(this.moduleName, filePath))
    }

    /**
     * - Gets the file from the given [filePath] and the given [moduleName] in the constructor
     * @param {String} filePath The file path to get from
     * @returns this for method chaining
     */
    setColorScheme(filePath) {
        this.colorScheme = JSON.parse(FileLib.read(this.moduleName, filePath))

        return this
    }

    /**
     * - Gets the current color scheme and returns the object
     * @returns {Object}
     */
    getColorScheme() {
        return this.colorScheme
    }

    /**
     * - Draws the given components on this window but without calling [_create()] method
     * @param {Array|Any} components 
     * @returns 
     */
    _drawNormal(components) {
        if (!(components instanceof Array)) return components.setChildOf(this.window)

        components.forEach(element => element.setChildOf(this.window))
    }

    /**
     * - Draws the given components on this window
     * @param {Array|Any} components 
     * @param {Boolean} isComponent whether the component is a custom element or not (true by default)
     * @returns 
     */
    draw(components, isComponent = true) {
        if (!isComponent) return this._drawNormal(components)

        if (!(components instanceof Array)) return components._create(this.getColorScheme()).setChildOf(this.window)

        components.forEach(element => element._create(this.getColorScheme()).setChildOf(this.window))
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