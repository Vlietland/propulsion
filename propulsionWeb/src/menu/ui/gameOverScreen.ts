import { Scene, Vector, Color, Actor, Engine, Text, Font, FontUnit } from 'excalibur'
import { MenuButton } from '@src/menu/menuButton'

export interface GameOverScreenOptions {
    onRestart: () => void
    onMainMenu?: () => void
}

export class GameOverScreen {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'game-over-screen'
    private static instance: GameOverScreen | null = null

    constructor(private engine: Engine, private score: number, private options: GameOverScreenOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createGameOverElements()
        this.createButtons()
    }

    private createGameOverElements(): void {
        const titleActor = new Actor({ pos: new Vector(0, -150), anchor: Vector.Half })
        titleActor.graphics.use(new Text({
            text: 'MISSION FAILED',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 48, unit: FontUnit.Px })
        }))
        this.scene.add(titleActor)

        const scoreActor = new Actor({ pos: new Vector(0, -80), anchor: Vector.Half })
        scoreActor.graphics.use(new Text({
            text: `FINAL SCORE: ${this.score}`,
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
        }))
        this.scene.add(scoreActor)
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
        this.engine.remove(this.sceneName)
        GameOverScreen.instance = null
    }

    static show(score: number, onRestart: () => void, onMainMenu?: () => void, engine?: Engine) {
        if (!engine) return
        if (GameOverScreen.instance) GameOverScreen.instance.dispose()
        GameOverScreen.instance = new GameOverScreen(engine, score, {
            onRestart, onMainMenu
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