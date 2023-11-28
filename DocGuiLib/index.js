// This is all testing code if it isn't obvious enough

import HandleGui from "./core/Gui"
import ButtonElement from "./elements/Button"
import BoxElement from "./elements/Box"
import TextInputElement from "./elements/TextInput"
import ColorPickerElement from "./elements/ColorPicker"

const gui = new HandleGui().setCommand("testdoc")
const btn1 = new ButtonElement().setString("test").addHandler((comp, event) => ChatLib.chat("test 1"))
const btn2 = new ButtonElement().setString("test 2").addHandler((comp, event) => { ChatLib.chat("test 2") })

const textInput = new TextInputElement("test 3", 1, 25).addOnKeyTypeEvent((inputText) => {
    ChatLib.chat(inputText)
})

const pickColor = new ColorPickerElement("Hex color", 1, 35).setSize(50, 50, false)

const element = new BoxElement()

element
    .setPosition(10, 10)
    .setText("testing block")
    .addButton([btn1, btn2, textInput, pickColor])

gui.draw(element)

/**
TODO:
change the [Button] and [Box] classes to either their own thing
or make them be able to set manual positions and stuff so others can use it
instead of the current system where it auto aligns with itself
*/