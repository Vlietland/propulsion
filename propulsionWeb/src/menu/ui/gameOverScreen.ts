import { Scene, Vector, Color, Actor, Engine, Text, Font, FontUnit } from 'excalibur'
import { MenuButton } from '@src/menu/ui/menuButton'
import { NameEntry } from './nameEntry'

export interface GameOverScreenOptions {
    onRestart: () => void
    onMainMenu?: () => void
    onNameSubmit?: (name: string) => void
}

export class GameOverScreen {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'game-over-screen'
    private static instance: GameOverScreen | null = null
    private nameEntry?: NameEntry

    constructor(private engine: Engine, private score: number, private isHighScore: boolean, private options: GameOverScreenOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createElements()
        if (isHighScore) this.startNameEntry()
        else this.createButtons()
    }

    private createElements(): void {
        const title = this.createTextActor(
            this.isHighScore ? 'NEW HIGH SCORE!' : 'MISSION FAILED',
            new Vector(0, -150),
            this.isHighScore ? new Color(100, 255, 100) : new Color(255, 100, 100),
            48
        )
        const score = this.createTextActor(`FINAL SCORE: ${this.score}`, new Vector(0, -80), new Color(255, 255, 100), 24)
        this.scene.add(title)
        this.scene.add(score)
    }

    private createTextActor(text: string, pos: Vector, color: Color, size: number): Actor {
        const actor = new Actor({ pos, anchor: Vector.Half })
        actor.graphics.use(new Text({ text, color, font: new Font({ family: 'monospace', size, unit: FontUnit.Px }) }))
        return actor
    }

    private startNameEntry(): void {
        if (this.options.onNameSubmit) {
            this.nameEntry = new NameEntry(this.scene, this.engine, (name: string) => {
                this.options.onNameSubmit!(name)
                this.createButtons()
            })
        }
    }

    private createButtons(): void {
        const configs = [
            { text: 'RESTART MISSION', action: this.options.onRestart },
            ...(this.options.onMainMenu ? [{ text: 'MAIN MENU', action: this.options.onMainMenu }] : [])
        ]
        configs.forEach((config, index) => {
            const button = new MenuButton(config.text, new Vector(0, 50 + index * 70), config.action)
            this.buttons.push(button)
            this.scene.add(button.actor)
            this.scene.add(button)
        })
    }

    public show(): void {
        this.buttons.forEach(button => button.show())
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
    }

    public hide(): void {
        this.buttons.forEach(button => button.hide())
    }

    public dispose(): void {
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        //this.engine.remove(this.sceneName)
        GameOverScreen.instance = null
    }

    static show(score: number, isHighScore: boolean, onRestart: () => void, onMainMenu?: () => void, onNameSubmit?: (name: string) => void, engine?: Engine) {
        if (!engine) return
        if (GameOverScreen.instance) GameOverScreen.instance.dispose()
        GameOverScreen.instance = new GameOverScreen(engine, score, isHighScore, {
            onRestart, onMainMenu, onNameSubmit
        })
        GameOverScreen.instance.show()
    }

    static hideCurrentInstance(): void {
        if (GameOverScreen.instance) GameOverScreen.instance.hide()
    }

    static disposeCurrentInstance(): void {
        if (GameOverScreen.instance) GameOverScreen.instance.dispose()
    }
}