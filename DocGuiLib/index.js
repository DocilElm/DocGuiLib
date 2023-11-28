// This is all testing code if it isn't obvious enough

import HandleGui from "./core/Gui"
import ButtonElement from "./elements/Button"
import BoxElement from "./elements/Box"
import TextInputElement from "./elements/TextInput"

const gui = new HandleGui().setCommand("testdoc")
const btn1 = new ButtonElement().setString("test").addHandler((comp, event) => ChatLib.chat("test 1"))
const btn2 = new ButtonElement().setString("test 2").addHandler((comp, event) => { ChatLib.chat("test 2") })
const textInput = new TextInputElement("test 3", 1, 50)
const element = new BoxElement()

element
    .setPosition(10, 10)
    .setText("testing block")
    .addButton([btn1, btn2, textInput])

gui.draw(element)