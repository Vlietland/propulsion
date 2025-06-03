import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'

export class BriefingScreen {
    private scene: Scene
    private sceneName = 'briefing-screen'

    constructor(private engine: Engine, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        
        // Create title
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'CLASSIFIED BRIEFING',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)

        // Create story content
        const lines = [
            "STARDATE 2387.6 - SECTOR ZETA-PRIME",
            "",
            "Commander, the situation is critical. Our deep space mining",
            "operations have been compromised by an unknown gravitational",
            "anomaly. Valuable cargo pods containing rare quantum crystals",
            "are being pulled into dangerous hyperspace rifts.",
            "",
            "Your mission: Navigate the unstable space around the anomaly",
            "using your ship's experimental tractor beam technology.",
            "Collect as many cargo pods as possible before they're lost",
            "to the void. Each pod contains materials essential for",
            "humanity's expansion into the outer rim.",
            "",
            "WARNING: The gravitational fields are unpredictable.",
            "Maintain safe distance while using your tractor beam.",
            "If a pod reaches critical proximity to a rift, it will",
            "hyperspace jump to safety - but the mission continues.",
            "",
            "The fate of the colony ships depends on your success.",
            "Failure is not an option.",
            "",
            "Good hunting, Commander."
        ]

        lines.forEach((line, index) => {
            const textActor = new Actor({ pos: new Vector(0, -200 + index * 25), anchor: Vector.Half })
            const color = line.startsWith('WARNING:') ? new Color(255, 200, 100) :
                         line.startsWith('STARDATE') ? new Color(100, 200, 255) :
                         line === '' ? Color.Transparent :
                         new Color(200, 200, 200)
            
            textActor.graphics.use(new Text({
                text: line,
                color: color,
                font: new Font({ 
                    family: 'monospace', 
                    size: line.startsWith('STARDATE') || line.startsWith('WARNING:') ? 18 : 16, 
                    unit: FontUnit.Px 
                })
            }))
            this.scene.add(textActor)
        })

        // Controls section title
        const controlsTitle = new Actor({ pos: new Vector(0, 300), anchor: Vector.Half })
        controlsTitle.graphics.use(new Text({
            text: 'SHIP CONTROLS',
            color: new Color(100, 255, 100),
            font: new Font({ family: 'monospace', size: 20, unit: FontUnit.Px })
        }))
        this.scene.add(controlsTitle)
        const controls = ["ARROW KEYS / WASD - Navigate", "SPACEBAR - Tractor beam", "ESC - Abort mission"]
        controls.forEach((control, index) => {
            const actor = new Actor({ pos: new Vector(0, 330 + index * 25), anchor: Vector.Half })
            actor.graphics.use(new Text({
                text: control,
                color: new Color(150, 255, 150),
                font: new Font({ family: 'monospace', size: 14, unit: FontUnit.Px })
            }))
            this.scene.add(actor)
        })

        // Create return instruction
        const backActor = new Actor({ pos: new Vector(0, 450), anchor: Vector.Half })
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

    public hide(): void {
        // Scene cleanup handled by engine
    }

    public dispose(): void {
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}
