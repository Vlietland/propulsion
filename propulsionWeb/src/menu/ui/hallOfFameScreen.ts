import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'
import { StarField } from '@src/game/ui/starField'

export class HallOfFameScreen {
    private scene: Scene
    private sceneName = 'hall-of-fame-screen'
    private keyboardListener?: (evt: KeyEvent) => void
    private starField?: StarField

    constructor(private engine: Engine, private scoreManager: ScoreManager, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createStarField()
        this.createStaticElements()
        this.engine.add(this.sceneName, this.scene)
    }

    private createStaticElements(): void {
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'HALL OF FAME',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)

        const subtitle = new Actor({ pos: new Vector(0, -240), anchor: Vector.Half })
        subtitle.graphics.use(new Text({
            text: 'TOP COMMANDERS',
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 18, unit: FontUnit.Px })
        }))
        this.scene.add(subtitle)

        this.createHeaders()
        this.createBackInstruction()
    }

    private createHeaders(): void {
        const headerY = -180
        const headers = [
            { text: 'RANK', x: -180 },
            { text: 'SCORE', x: 20 },
            { text: 'COMMANDER', x: 170 }
        ]

        headers.forEach(header => {
            const actor = new Actor({ pos: new Vector(header.x, headerY), anchor: Vector.Half })
            actor.graphics.use(new Text({
                text: header.text,
                color: new Color(100, 255, 100),
                font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
            }))
            this.scene.add(actor)
        })

        const separator = new Actor({ pos: new Vector(0, -160), anchor: Vector.Half })
        separator.graphics.use(new Text({
            text: '─'.repeat(50),
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 14, unit: FontUnit.Px })
        }))
        this.scene.add(separator)
    }

    private createBackInstruction(): void {
        const backActor = new Actor({ pos: new Vector(0, 220), anchor: Vector.Half })
        backActor.graphics.use(new Text({
            text: "Press ESC to return to main menu",
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(backActor)
    }

    private createStarField(): void {
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        this.starField = new StarField(
            this.scene, 
            80, 
            new Vector(-screenWidth/2, -screenHeight/2), 
            new Vector(screenWidth/2, screenHeight/2)
        )
    }

    private setupInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Escape) {
                this.onBack()
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
    }

    public show(): void {
        this.updateScoreEntries()
        this.engine.goToScene(this.sceneName)
        this.setupInput()
    }

    private updateScoreEntries(): void {
        this.removeScoreEntries()
        const highScores = this.scoreManager.getHighScores()
        
        highScores.forEach((entry, index) => {
            const yPos = -130 + (index * 30)
            const entryActors = [
                { text: `${entry.position}.`, x: -180, color: new Color(255, 255, 255) },
                { text: entry.score.toLocaleString(), x: 20, color: new Color(255, 255, 100) },
                { text: entry.name || 'UNKNOWN', x: 170, color: new Color(150, 200, 255) }
            ]

            entryActors.forEach((actorData, actorIndex) => {
                const actor = new Actor({ 
                    pos: new Vector(actorData.x, yPos), 
                    anchor: Vector.Half, 
                    name: `score-entry-${index}-${actorIndex}` 
                })
                actor.graphics.use(new Text({
                    text: actorData.text,
                    color: actorData.color,
                    font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
                }))
                this.scene.add(actor)
            })
        })
    }

    private removeScoreEntries(): void {
        this.scene.actors.forEach(actor => {
            if (actor.name?.startsWith('score-entry')) {
                actor.kill()
            }
        })
    }

    public dispose(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
        this.starField?.dispose()
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}
