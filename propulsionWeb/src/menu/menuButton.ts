import { Actor, Vector, Rectangle, Color, Font, FontUnit, Text, Line, GraphicsGroup } from 'excalibur'

export class MenuButton {
    public actor: Actor
    private isHovered: boolean = false

    constructor(text: string, position: Vector, private action: () => void) {
        this.actor = new Actor({ pos: position, anchor: Vector.Half })
        
        const mainBg = new Rectangle({ 
            width: 300, 
            height: 50, 
            color: new Color(5, 15, 35, 200),
            strokeColor: new Color(0, 120, 200, 255), 
            lineWidth: 2
        })
        
        const glowEffect = new Rectangle({ 
            width: 296, 
            height: 46, 
            color: new Color(0, 80, 160, 40)
        })
        
        const cornerLines = [
            new Line({ start: new Vector(0, 0), end: new Vector(20, 0), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(0, 0), end: new Vector(0, 10), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(280, 0), end: new Vector(300, 0), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(300, 0), end: new Vector(300, 10), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(0, 40), end: new Vector(0, 50), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(0, 50), end: new Vector(20, 50), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(300, 40), end: new Vector(300, 50), color: new Color(0, 200, 255), thickness: 2 }),
            new Line({ start: new Vector(280, 50), end: new Vector(300, 50), color: new Color(0, 200, 255), thickness: 2 })
        ]
        
        const txt = new Text({ 
            text, 
            color: new Color(180, 220, 255), 
            font: new Font({ 
                family: 'Courier New, monospace', 
                size: 18, 
                unit: FontUnit.Px
            })
        })
        
        const graphics = new GraphicsGroup({ 
            members: [mainBg, glowEffect, ...cornerLines, txt] 
        })
        
        this.actor.graphics.use(graphics)
        
        this.actor.on('pointerdown', () => this.action())
        this.actor.on('pointerenter', () => {
            mainBg.strokeColor = new Color(0, 180, 255, 255)
            glowEffect.color = new Color(0, 120, 200, 80)
            txt.color = new Color(220, 240, 255)
            cornerLines.forEach(line => line.color = new Color(0, 240, 255))
            this.isHovered = true
        })
        this.actor.on('pointerleave', () => {
            mainBg.strokeColor = new Color(0, 120, 200, 255)
            glowEffect.color = new Color(0, 80, 160, 40)
            txt.color = new Color(180, 220, 255)
            cornerLines.forEach(line => line.color = new Color(0, 200, 255))
            this.isHovered = false
        })
    }

    public dispose(): void {
        this.actor.kill()
    }
}