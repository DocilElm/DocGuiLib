// This is all testing code if it isn't obvious enough

import HandleGui from "./core/Gui"
import ButtonElement from "./elements/Button"
import BoxElement from "./elements/Box"
import TextInputElement from "./elements/TextInput"
import ColorPickerElement from "./elements/ColorPicker"
import SliderElement from "./elements/Slider"
import SelectionElement from "./elements/Selection"
import DividerElement from "./elements/Divider"
import SwitchElement from "./elements/Switch"

const gui = new HandleGui("data/DefaultColors.json").setCommand("testdoc")
const colorScheme = gui.getColorScheme()

const btn1 = new ButtonElement("test", 1, 5, 80, 8)
    .onMouseClickEvent(() => ChatLib.chat("test 1"))

const btn2 = new ButtonElement("test 2", 1, 15, 80, 8)
    .onMouseClickEvent(() => ChatLib.chat("test 2"), true)

const textInput = new TextInputElement("test 3", 1, 25, 80).onKeyTypeEvent((inputText) => {
    ChatLib.chat(inputText)
})

const pickColor = new ColorPickerElement("Hex color", 1, 35, 80, 8)
    .setSchemeValue("backgroundBox", [0, 255, 0, 80], colorScheme)
    .setSchemeValue("textColor", [0, 255, 0, 255])

const slider = new SliderElement([0, 10], 1, 1, 50, 80, 8).onMouseDragEvent((x, y, button, component) => {
    ChatLib.chat(`slider test`)
})

// This is an example with the slider's built-in event being cancelled
const slider2 = new SliderElement([0, 10], 2, 1, 80, 100)
    .onMouseDragEvent((x, y, button, component) => {
        // you can make your custom animation for it here if you want to
        component.setX((x).pixel())
    }, true)
    .onMouseClickEvent(() => { // we also need to cancel the click event since this is for the on click custom event feature
        ChatLib.chat("something")
    }, true)

const selection = new SelectionElement(["a", "test", "a part 2"], 1, 1, 58, 80, 5)

const dividerA = new DividerElement("SOMETHING ABOUT THIS ASKDHJBAKSJBDJKA", 1, 65, 100, 5)

const switchcomp = new SwitchElement(false, 1, 75, 25, 8)
//     .onMouseClickEvent((comp) => ChatLib.chat(`component clicked ${comp}`))
//     .onMouseEnterEvent((comp) => ChatLib.chat(`A: ${comp}`))
//     .onMouseLeaveEvent((comp) => ChatLib.chat(`B: ${comp}`))
//     // Changing the default [backgroundBox] color scheme
//     .setSchemeValue("backgroundBox", [0, 255, 0, 80], colorScheme)
//     // Changing the text color to blue
//     // see how passing [colorScheme] is no longer necessary
//     // that's because the above method already set it up for us
//     .setSchemeValue("textColor", [0, 0, 255, 255])
//     // Changing the text scale
//     // This will always translate into pixels
//     .setSchemeValue("textScale", 0.7)

const element = new BoxElement()

element
    .setPosition(10, 10)
    .setText("testing block")
    .addButton([btn1, btn2, textInput, pickColor, slider, selection, dividerA, switchcomp])

gui.draw(element)