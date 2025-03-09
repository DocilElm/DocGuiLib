const GuiScreen = net.minecraft.client.gui.GuiScreen
const MouseListener = com.chattriggers.ctjs.minecraft.listeners.MouseListener.INSTANCE

/**
 * * Custom Gui "wrapper" without using chattriggers
 * * Works similarly to CT's `Gui`
 */
export class CustomGui {
    constructor() {
        this.guiScreen = new JavaAdapter(GuiScreen, {
            /* drawScreen */func_73863_a: (mx, my, pticks) => this.drawScreen(mx, my, pticks),
            /* mouseClicked */func_73864_a: (mx, my, mbtn) => this.mouseClicked(mx, my, mbtn),
            /* mouseReleased */func_146286_b: (mx, my, state) => this.mouseReleased(mx, my, state),
            /* mouseClickMove */func_146273_a: (mx, my, clickedButton, lastClick) => this.mouseClickMove(mx, my, clickedButton, lastClick),
            /* initGui */func_73866_w_: () => this.initGui(),
            /* keyTyped */func_73869_a: (char, keycode) => this.keyTyped(char, keycode),
            /* doesGuiPauseGame */func_73868_f() {
                return false
            },
            /* onGuiClosed */func_146281_b: () => this.onGuiClosed(),
            /* onResize */func_175273_b: (mcIn, width, height) => this.onResize(mcIn, width, height),
            /* mc */field_146297_k: Client.getMinecraft(),
            _customDrawScreen(mx, my, pticks) {
                this.super$func_73863_a(mx, my, pticks)
            },
            _customMouseClicked(mx, my, mbtn) {
                this.super$func_73864_a(mx, my, mbtn)
            },
            _customMouseReleased(mx, my, state) {
                this.super$func_146286_b(mx, my, state)
            },
            _customMouseClickMove(mx, my, clickedButton, lastClick) {
                this.super$func_146273_a(mx, my, clickedButton, lastClick)
            },
            _customInitGui() {
                this.super$func_73866_w_()
            },
            _customKeyTyped(char, keycode) {
                this.super$func_73869_a(char, keycode)
            },
            _customOnGuiClosed() {
                this.super$func_146281_b()
            },
            _customOnResize(mcIn, width, height) {
                this.super$func_175273_b(mcIn, width, height)
            }
        })

        this.listeners = {
            onDraw: null,
            onClick: null,
            onScroll: null,
            onKeyTyped: null,
            onReleased: null,
            onDragged: null,
            onOpen: null,
            onClose: null,
            onInit: null,
            onResize: null
        }

        MouseListener.registerScrollListener((x, y, delta) => {
            if (!this.isOpen()) return

            this.listeners.onScroll?.(x, y, delta)
        })
    }

    open() {
        GuiHandler.openGui(this.guiScreen)
        this.listeners?.onOpen?.()

        return this
    }

    close() {
        Player.getPlayer()?./* closeScreen */func_71053_j()
        this.listeners?.onClose?.(this.guiScreen)

        return this
    }

    isOpen() {
        return Client.currentGui.get()?.equals(this.guiScreen)
    }

    // Gui shit
    initGui() {
        this.guiScreen._customInitGui()
        this.listeners.onInit?.()
    }

    drawScreen(mx, my, pticks) {
        this.guiScreen._customDrawScreen(mx, my, pticks)

        Tessellator.pushMatrix()

        this.listeners.onDraw?.(mx, my, pticks)

        Tessellator.popMatrix()
    }

    mouseClicked(mx, my, mbtn) {
        this.guiScreen._customMouseClicked(mx, my, mbtn)
        this.listeners.onClick?.(mx, my, mbtn)
    }

    mouseReleased(mx, my, state) {
        this.guiScreen._customMouseReleased(mx, my, state)
        this.listeners.onReleased?.(mx, my, state)
    }

    mouseClickMove(mx, my, clickedButton, lastClick) {
        this.guiScreen._customMouseClickMove(mx, my, clickedButton, lastClick)
        this.listeners.onDragged?.(mx, my, clickedButton, lastClick)
    }

    keyTyped(char, keycode) {
        this.guiScreen._customKeyTyped(char, keycode)
        this.listeners.onKeyTyped?.(char, keycode)
    }

    onResize(mcIn, width, height) {
        this.guiScreen._customOnResize(mcIn, width, height)
        this.listeners.onResize?.(mcIn, width, height)
    }

    onGuiClosed() {
        this.guiScreen._customOnGuiClosed()
        this.listeners.onClose?.(this.guiScreen)
    }

    // Listeners
    registerDraw(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onDraw = cb

        return this
    }

    registerClicked(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onClick = cb

        return this
    }

    registerScrolled(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onScroll = cb

        return this
    }

    registerKeyTyped(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onKeyTyped = cb

        return this
    }

    registerMouseDragged(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onDragged = cb

        return this
    }

    registerMouseReleased(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onReleased = cb

        return this
    }

    registerOpened(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onOpen = cb

        return this
    }

    registerClosed(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onClose = cb

        return this
    }

    registerInit(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onInit = cb

        return this
    }

    registerResize(cb) {
        if (typeof cb !== "function") throw `[DocGuiLib] ${cb} is not a valid function.`
        this.listeners.onResize = cb

        return this
    }
}