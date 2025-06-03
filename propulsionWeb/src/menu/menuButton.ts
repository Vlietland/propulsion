import { Actor, Vector, Rectangle, Color, Font, FontUnit, Text } from 'excalibur'

export class MenuButton {
    public actor: Actor

    constructor(text: string, position: Vector, private action: () => void) {
        this.actor = new Actor({ pos: position, anchor: Vector.Half })
        
        const bg = new Rectangle({ width: 300, height: 50, color: new Color(0, 50, 100, 40), strokeColor: new Color(100, 150, 200), lineWidth: 2 })
        const txt = new Text({ text, color: new Color(180, 180, 180), font: new Font({ family: 'monospace', size: 20, unit: FontUnit.Px }) })
        
        this.actor.graphics.add(bg)
        this.actor.graphics.add(txt)
        
        this.actor.on('pointerdown', () => this.action())
        this.actor.on('pointerenter', () => {
            txt.color = new Color(220, 220, 220)
            bg.strokeColor = new Color(150, 200, 255)
        })
        this.actor.on('pointerleave', () => {
            txt.color = new Color(180, 180, 180)
            bg.strokeColor = new Color(100, 150, 200)
        })
    }

    public dispose(): void { this.actor.kill() }
}