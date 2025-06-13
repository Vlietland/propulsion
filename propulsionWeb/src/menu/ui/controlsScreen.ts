import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'
import { StarField } from '@src/game/ui/starField'

export class ControlsScreen {
    private scene: Scene
    private sceneName = 'controls-screen'
    private keyboardListener?: (evt: KeyEvent) => void
    private starField?: StarField

    constructor(private engine: Engine, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createStarField()
        this.engine.add(this.sceneName, this.scene)        
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'SHIP CONTROLS',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)

        const lines = [
            "CONTROL PROTOCOLS - STARFLEET STANDARD",
            "",
            "MOVEMENT CONTROLS:",
            "Z - Rotate ship counter-clockwise",
            "X - Rotate ship clockwise        ", 
            "SHIFT - Activate main thrusters",
            "",
            "MISSION CONTROLS:",
            "ENTER - Activate Photon Bullet Cannon",
            "SPACEBAR - Activate experimental tractor beam",
            "ESC - Emergency abort / Pause mission",
            "",
            "TACTICAL INFORMATION:",
            "Your ship operates on momentum-based physics. Use thrust carefully",
            "to navigate gravitational fields and avoid collision with cave walls.",
            "The tractor beam can collect cargo pods and manipulate objects,",
            "but consumes significant power during operation.",
            "Monitor your fuel levels closely. Running out of fuel in deep space",
            "will result in mission failure and loss of the ship.",
            "",
            "Remember: Precision and patience are key to successful missions."
        ]

        lines.forEach((line, index) => {
            const textActor = new Actor({ pos: new Vector(0, -220 + index * 20), anchor: Vector.Half })
            const color = line.startsWith('CONTROL PROTOCOLS') ? new Color(100, 200, 255) :
                         line.startsWith('MOVEMENT CONTROLS:') || line.startsWith('MISSION CONTROLS:') || line.startsWith('TACTICAL INFORMATION:') ? new Color(100, 255, 100) :
                         line === '' ? Color.Transparent :
                         new Color(200, 200, 200)
            
            textActor.graphics.use(new Text({
                text: line,
                color: color,
                font: new Font({ 
                    family: 'monospace', 
                    size: line.startsWith('CONTROL PROTOCOLS') || line.includes('CONTROLS:') || line.startsWith('TACTICAL INFORMATION:') ? 16 : 14, 
                    unit: FontUnit.Px 
                })
            }))
            this.scene.add(textActor)
        })

        const backActor = new Actor({ pos: new Vector(0, 260), anchor: Vector.Half })
        backActor.graphics.use(new Text({
            text: "Press ESC to return to main menu",
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 16, unit: FontUnit.Px })
        }))
        this.scene.add(backActor)
    }

    private setupInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Escape) {
                this.onBack()
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
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

    public show(): void {
        this.engine.goToScene(this.sceneName)
        this.setupInput()
    }

    public dispose(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }    
}
