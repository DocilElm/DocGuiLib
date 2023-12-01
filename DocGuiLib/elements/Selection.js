import { CenterConstraint, UIRoundedRectangle, UIText } from "../../Elementa"
import ElementUtils from "../core/Element"
import BaseElement from "./Base"

export default class SelectionElement extends BaseElement {
    constructor(selections = [], x, y, width, height) {
        super(x, y, width, height)

        this.selections = selections
        this.value = 0
    }

    /**
     * - Gets the current value's index
     * @returns {Number}
     */
    getValue() {
        return this.value
    }

    _setText(component, index) {
        if (index < 0) index = 0
        if (index > this.selections.length - 1) index = this.selections.length - 1

        component.setText(this.selections[index])
        this.value = index
    }

    _create() {
        this.box = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(new ElementUtils.JavaColor(0 / 255, 0 / 255, 0 / 255, 80 / 255))

        this.textValue = new UIText(this.selections[0])
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.box)

        this.leftArrow = new UIText("❰")
            .setX((1).pixel())
            .setY(new CenterConstraint())
            .setChildOf(this.box)

        this.rightArrow = new UIText("❱")
            .setX((1).pixel(true))
            .setY(new CenterConstraint())
            .setChildOf(this.box)

        // Event handlers
        this.leftArrow.onMouseClick(() => {
            this.value--
            this._setText(this.textValue, this.value)
        })

        this.rightArrow.onMouseClick(() => {
            this.value++
            this._setText(this.textValue, this.value)
        })

        return this.box
    }
}