import { Scene, Vector, Color, Actor, Text, Font, FontUnit, Engine, Keys, KeyEvent } from 'excalibur'

export class CreditsScreen {
    private scene: Scene
    private sceneName = 'credits-screen'

    constructor(private engine: Engine, private onBack: () => void) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        
        const title = new Actor({ pos: new Vector(0, -280), anchor: Vector.Half })
        title.graphics.use(new Text({
            text: 'MISSION CREDITS',
            color: new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 32, unit: FontUnit.Px })
        }))
        this.scene.add(title)

        const lines = [
            "PROPULSION - STELLAR RECONNAISSANCE PROJECT",
            "",
            "COMMAND STAFF:",
            "Mission Commander - Jan Vlietland",
            "Lead Developer - Jan Vlietland",
            "Systems Engineer - Claude Sonnet, Anthropic",
            "",
            "TECHNICAL DIVISION:",
            "Game Engine - Excalibur.js Development Team",
            "Level Design - Tiled Map Editor Development Team",
            "Audio Design - https://sfxr.me/, Chris McCormick",
            "Physics Simulation - Custom Implementation",
            "",
            "LEGACY OPERATIONS:",
            "Original Concept - Based on classic Thrust gameplay mechanics",
            "Retro Design Inspiration - 1980s space exploration games",
            "Historical Reference - my C++ and Assembly codebase from 1997",
            "",
            "SPECIAL ACKNOWLEDGMENTS:",
            "The open source community for tools and frameworks",
            "Classic game developers who pioneered space physics gaming",
            "Beta testers and mission support personnel",
            "",
            "© 2025 Propulsion Project - GNU General Public License v3"
        ]

        lines.forEach((line, index) => {
            const textActor = new Actor({ pos: new Vector(0, -200 + index * 20), anchor: Vector.Half })
            const color = line.startsWith('PROPULSION - STELLAR') ? new Color(100, 200, 255) :
                         line.startsWith('COMMAND STAFF:') || line.startsWith('TECHNICAL DIVISION:') || line.startsWith('LEGACY OPERATIONS:') || line.startsWith('SPECIAL ACKNOWLEDGMENTS:') ? new Color(100, 255, 100) :
                         line.startsWith('©') ? new Color(255, 200, 100) :
                         line === '' ? Color.Transparent :
                         new Color(200, 200, 200)
            
            textActor.graphics.use(new Text({
                text: line,
                color: color,
                font: new Font({ 
                    family: 'monospace', 
                    size: line.startsWith('PROPULSION - STELLAR') || line.includes('STAFF:') || line.includes('DIVISION:') || line.includes('OPERATIONS:') || line.includes('ACKNOWLEDGMENTS:') ? 18 : 16, 
                    unit: FontUnit.Px 
                })
            }))
            this.scene.add(textActor)
        })

        const backActor = new Actor({ pos: new Vector(0, 280), anchor: Vector.Half })
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
        
    }

    public dispose(): void {
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}
