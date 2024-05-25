import { Animations, CenterConstraint, ConstantColorConstraint, OutlineEffect, UIRoundedRectangle, UIText, animate } from "../../Elementa"
import BaseElement from "./Base"

export default class CheckboxElement extends BaseElement {
    constructor(check = false, x, y, width, height, outline = false) {
        super(x, y, width, height, check, null, "Checkbox", outline)
    }

    _create(colorScheme = {}, elementType = null) {
        if (!this.colorScheme) this.colorScheme = colorScheme
        if (elementType) this.elementType = elementType

        this.checkBox = new UIRoundedRectangle(3)
            .setX(this.x)
            .setY(this.y)
            .setWidth(this.width)
            .setHeight(this.height)
            .setColor(this._getCurrentColor())

        this.checkMark = new UIText(this.value ? this._getSchemeValue("enabledCheck") : this._getSchemeValue("disabledCheck"))
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.checkBox)
            
        if (this.outline) this.checkBox.enableEffect(new OutlineEffect(this._getColor("outlineColor"), this._getSchemeValue("outlineThickness")))

        this.checkBox.onMouseClick((component) => {
            this.value = !this.value

            if (this._triggerEvent(this.onMouseClick, this.getValue()) === 1) return

            animate(component, (animation) => {
                animation.setColorAnimation(
                    Animations[this._getSchemeValue("mouseClickAnimation")],
                    this._getSchemeValue("animationTime"),
                    new ConstantColorConstraint(this._getCurrentColor()),
                    0
                    )
            })

            this.checkMark.setText(this.value    
                ? this._getSchemeValue("enabledCheck")
                : this._getSchemeValue("disabledCheck")
                )
        })

        return this.checkBox
    }
}