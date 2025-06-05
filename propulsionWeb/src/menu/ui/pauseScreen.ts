import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'
import { MenuButton } from '@src/menu/menuButton'

export interface PauseScreenOptions {
    onResume: () => void
    onMainMenu?: () => void
}

export class PauseScreen {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'pause-screen'
    private static instance: PauseScreen | null = null
    private keyboardListener?: (evt: KeyEvent) => void

    constructor(private engine: Engine, private options: PauseScreenOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(0, 0, 0, 150) // Semi-transparent overlay
        this.scene.camera.pos = new Vector(0, 0)
        this.createPauseElements()
        this.createButtons()
        this.setupInput()
    }

    private createPauseElements(): void {
        const titleActor = new Actor({ pos: new Vector(0, -120), anchor: Vector.Half })
        titleActor.graphics.use(new Text({
            text: 'MISSION PAUSED',
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(titleActor)

        const subtitleActor = new Actor({ pos: new Vector(0, -70), anchor: Vector.Half })
        subtitleActor.graphics.use(new Text({
            text: 'Choose your next action, Commander',
            color: new Color(200, 200, 200),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(subtitleActor)
    }

    private createButtons(): void {
        const configs = [
            { text: 'RESUME MISSION', action: this.options.onResume },
            ...(this.options.onMainMenu ? [{ text: 'ENGAGE ESCAPE POD', action: this.options.onMainMenu }] : [])
        ]

        configs.forEach((config, index) => {
            const button = new MenuButton(config.text, new Vector(0, 20 + index * 70), config.action)
            this.buttons.push(button)
            this.scene.add(button.actor)
            this.scene.add(button)
        })

        // Add instruction text
        const instructionActor = new Actor({ pos: new Vector(0, 150), anchor: Vector.Half })
        instructionActor.graphics.use(new Text({
            text: "Press ESC to resume mission",
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 14, unit: FontUnit.Px })
        }))
        this.scene.add(instructionActor)
    }

    private setupInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Escape) {
                this.options.onResume()
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
    }

    private removeInput(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
    }

    public show(): void {
        this.buttons.forEach(button => button.show())
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
    }

    public hide(): void {
        this.buttons.forEach(button => button.hide())
        this.removeInput()
    }

    public dispose(): void {
        this.removeInput()
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        this.engine.remove(this.sceneName)
        PauseScreen.instance = null
    }

    static show(onResume: () => void, onMainMenu?: () => void, engine?: Engine) {
        if (!engine) return
        if (PauseScreen.instance) PauseScreen.instance.dispose()
        PauseScreen.instance = new PauseScreen(engine, {
            onResume,
            onMainMenu
        })
        PauseScreen.instance.show()
    }

    static hideCurrentInstance(): void {
        if (PauseScreen.instance) {
            PauseScreen.instance.hide()
        }
    }

    static disposeCurrentInstance(): void {
        if (PauseScreen.instance) {
            PauseScreen.instance.dispose()
        }
    }
}
