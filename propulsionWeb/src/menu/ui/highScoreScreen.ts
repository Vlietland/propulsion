import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'

export class HighScoreScreen {
    private scene: Scene
    private sceneName = 'high-score-screen'

    constructor(private engine: Engine, private scoreManager: ScoreManager, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createHighScoreDisplay()
    }

    private createHighScoreDisplay(): void {
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'HIGH SCORES',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)

        const subtitle = new Actor({ pos: new Vector(0, -240), anchor: Vector.Half })
        subtitle.graphics.use(new Text({
            text: 'HALL OF FAME - TOP COMMANDERS',
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 18, unit: FontUnit.Px })
        }))
        this.scene.add(subtitle)

        const highScores = this.scoreManager.getHighScores()
        
        const headerY = -180
        const positionHeader = new Actor({ pos: new Vector(-180, headerY), anchor: Vector.Half })
        positionHeader.graphics.use(new Text({
            text: 'RANK',
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(positionHeader)

        const scoreHeader = new Actor({ pos: new Vector(20, headerY), anchor: Vector.Half })
        scoreHeader.graphics.use(new Text({
            text: 'SCORE',
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(scoreHeader)

        const commanderHeader = new Actor({ pos: new Vector(170, headerY), anchor: Vector.Half })
        commanderHeader.graphics.use(new Text({
            text: 'COMMANDER',
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(commanderHeader)

        const separator = new Actor({ pos: new Vector(10, -160), anchor: Vector.Half })
        separator.graphics.use(new Text({
            text: '─'.repeat(50),
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 14, unit: FontUnit.Px })
        }))
        this.scene.add(separator)

        highScores.forEach((entry, index) => {
            const yPos = -130 + (index * 30)
            const positionActor = new Actor({ pos: new Vector(-180, yPos), anchor: Vector.Half })
            positionActor.graphics.use(new Text({
                text: `${entry.position}.`,
                color: new Color(255, 255, 255),
                font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
            }))
            this.scene.add(positionActor)

            const scoreActor = new Actor({ pos: new Vector(20, yPos), anchor: Vector.Half })
            scoreActor.graphics.use(new Text({
                text: entry.score.toLocaleString(),
                color: new Color(255, 255, 100),
                font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
            }))
            this.scene.add(scoreActor)

            const commanderActor = new Actor({ pos: new Vector(170, yPos), anchor: Vector.Half })
            const commanderNames = [
                'ADMIRAL CHEN',
                'CPT. RODRIGUEZ', 
                'CDR. WILLIAMS',
                'LT.CDR. PATEL',
                'LT. ANDERSON',
                'ENS. JOHNSON',
                'ENS. MARTINEZ',
                'CADET SMITH'
            ]
            commanderActor.graphics.use(new Text({
                text: commanderNames[index] || 'UNKNOWN',
                color: new Color(150, 200, 255),
                font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
            }))
            this.scene.add(commanderActor)
        })

        const backActor = new Actor({ pos: new Vector(0, 220), anchor: Vector.Half })
        backActor.graphics.use(new Text({
            text: "Press ESC or ENTER to return to main menu",
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(backActor)
    }

    private setupInput(): void {
        this.engine.input.keyboard.on('press', (evt: KeyEvent) => {
            if (evt.key === Keys.Escape || evt.key === Keys.Enter) {
                this.onBack()
            }
        })
    }

    public show(): void {
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
        this.setupInput()
    }

    public dispose(): void {
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}
