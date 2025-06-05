import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'

export class BriefingScreen {
    private scene: Scene
    private sceneName = 'briefing-screen'

    constructor(private engine: Engine, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'CLASSIFIED BRIEFING',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)
        const lines = [
            "STARDATE 2387.6 - SECTOR ZETA-PRIME",
            "",
            "Commander, the situation is critical. Our deep space mining operations",
            "have been compromised by hostile alien forces in the outer rim.",
            "Valuable cargo pods containing precious quantum crystals are scattered",
            "throughout the mining fields and heavily guarded by automated enemy turrets.",
            "",
            "Your mission: Navigate the treacherous gravitational caves and neutralize",
            "all enemy defenses. Collect the cargo pods using your experimental tractor",
            "beam technology. If possible, destroy the primary reactors that process",
            "the quantum crystals for the alien war machine. Each pod contains materials",
            "essential for humanity's expansion in the rim.",
            "",
            "WARNING: The primary reactor core is highly unstable and will trigger",
            "a catastrophic chain reaction, destroying everything within a 5000-mile",
            "radius. Calculate your escape route carefully and do not get caught",
            "in the blast zone. The fate of the colony ships and millions of lives",
            "depends on you.",
            "",
            "Good hunting, Commander. May the stars guide your path home."
        ]

        lines.forEach((line, index) => {
            const textActor = new Actor({ pos: new Vector(0, -220 + index * 20), anchor: Vector.Half })
            const color = line.startsWith('WARNING:') ? new Color(255, 200, 100) :
                         line.startsWith('STARDATE') ? new Color(100, 200, 255) :
                         line === '' ? Color.Transparent :
                         new Color(200, 200, 200)
            
            textActor.graphics.use(new Text({
                text: line,
                color: color,
                font: new Font({ 
                    family: 'monospace', 
                    size: line.startsWith('STARDATE') || line.startsWith('WARNING:') ? 16 : 14, 
                    unit: FontUnit.Px 
                })
            }))
            this.scene.add(textActor)
        })
        const backActor = new Actor({ pos: new Vector(0, 260), anchor: Vector.Half })
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
