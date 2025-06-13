import { Scene, Actor, Vector, Color, Text, Font, FontUnit, Keys, KeyEvent, Engine } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'

export interface HighScoreScreenOptions {
    onComplete: () => void
}

export class HighScoreScreen {
    private scene: Scene
    private sceneName = 'high-score-screen'
    private currentName = ''
    private keyboardListener?: (evt: KeyEvent) => void
    private actors: Actor[] = []
    private nameDisplayActor!: Actor

    constructor(private engine: Engine, private scoreManager: ScoreManager, private options: HighScoreScreenOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createElements()
        this.engine.add(this.sceneName, this.scene)
    }

    private createElements(): void {
        const currentScore = this.scoreManager.getScore()
        
        this.actors = [
            this.createTextActor('NEW HIGH SCORE!', new Vector(0, -150), new Color(100, 255, 100), 48),
            this.createTextActor(`FINAL SCORE: ${currentScore}`, new Vector(0, -100), new Color(255, 255, 100), 24),
            this.createTextActor('ENTER COMMANDER NAME:', new Vector(0, -30), new Color(255, 255, 100), 20),
            this.createTextActor('Press ENTER to confirm, ESC to skip', new Vector(0, 50), new Color(200, 200, 200), 14)
        ]
        
        this.nameDisplayActor = this.createTextActor('_', new Vector(0, 10), new Color(255, 255, 255), 24)
        this.actors.push(this.nameDisplayActor)
        
        this.actors.forEach(actor => this.scene.add(actor))
    }

    private createTextActor(text: string, pos: Vector, color: Color, size: number): Actor {
        const actor = new Actor({ pos, anchor: Vector.Half })
        actor.graphics.use(new Text({ text, color, font: new Font({ family: 'monospace', size, unit: FontUnit.Px }) }))
        return actor
    }

    public show(): void {
        this.engine.goToScene(this.sceneName)
        this.setupInput()
    }

    public hide(): void {
        this.cleanup()
    }

    private setupInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Enter) this.submit()
            else if (evt.key === Keys.Escape) this.skip()
            else if (evt.key === Keys.Backspace && this.currentName.length > 0) {
                this.currentName = this.currentName.slice(0, -1)
                this.updateDisplay()
            } else if (this.currentName.length < 12) {
                const char = this.parseKey(evt.key)
                if (char) {
                    this.currentName += char
                    this.updateDisplay()
                }
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
    }

    private parseKey(key: string): string {
        if (key.startsWith('Key') && key.length === 4) return key.charAt(3).toUpperCase()
        if (key.startsWith('Digit') && key.length === 6) return key.charAt(5)
        if (key === Keys.Space) return ' '
        if (key === Keys.Period) return '.'
        if (key === Keys.Minus) return '-'
        return ''
    }

    private updateDisplay(): void {
        this.nameDisplayActor.graphics.use(new Text({
            text: this.currentName + '_',
            color: new Color(255, 255, 255),
            font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
        }))
    }

    private submit(): void {
        const finalName = this.currentName.trim() || 'COMMANDER'
        this.scoreManager.addHighScore(this.scoreManager.getScore(), finalName)
        this.options.onComplete()
        this.cleanup()
    }

    private skip(): void {
        this.scoreManager.addHighScore(this.scoreManager.getScore(), 'ANONYMOUS')
        this.options.onComplete()
        this.cleanup()
    }

    private cleanup(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
    }

    public dispose(): void {
        this.cleanup()
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}
