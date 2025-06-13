import { Scene, Vector, Color, Actor, Engine, Text, Font, FontUnit } from 'excalibur'
import { MenuButton } from '@src/menu/ui/menuButton'
import { ScoreManager } from '@src/scoreManager'

export interface GameOverScreenOptions {
    onRestart: () => void
    onMainMenu?: () => void
}

export class GameOverScreen {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'game-over-screen'
    private titleActor: Actor = this.createTextActor('MISSION FAILED', new Vector(0, -150), new Color(255, 100, 100), 48)
    private scoreActor: Actor =this.createTextActor('FINAL SCORE: 0', new Vector(0, -80), new Color(255, 255, 100), 24)

    constructor(private engine: Engine, private scoreManager: ScoreManager, private options: GameOverScreenOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createButtons()
        this.engine.add(this.sceneName, this.scene)
        this.scene.add(this.titleActor)
        this.scene.add(this.scoreActor)
    }

    private createTextActor(text: string, pos: Vector, color: Color, size: number): Actor {
        const actor = new Actor({ pos, anchor: Vector.Half })
        actor.graphics.use(new Text({ text, color, font: new Font({ family: 'monospace', size, unit: FontUnit.Px }) }))
        return actor
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
        const currentScore = this.scoreManager.getScore()
        this.scoreActor.graphics.use(new Text({
            text: `FINAL SCORE: ${currentScore}`,
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
        }))
        this.buttons.forEach(button => button.show())
        this.engine.goToScene(this.sceneName)
    }

    public hide(): void {
        this.buttons.forEach(button => button.hide())
    }

    public dispose(): void {
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }

}