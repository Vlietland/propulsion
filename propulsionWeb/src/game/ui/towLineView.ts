import { Scene, Vector, Color, Actor, Line } from 'excalibur'

export class TowLineView {
    private towLine: Actor | null = null
    private scene: Scene | null = null

    constructor(scene: Scene | null) {
        this.scene = scene
    }

    public show(shipPos: Vector, ballPos: Vector): void {
        if (!this.scene) return
        
        // Remove existing line if any
        this.hide()
        
        // Create new tow line
        this.towLine = new Actor({
            pos: shipPos.clone(),
            anchor: Vector.Zero
        })
        
        // Calculate line from ship to ball
        const lineVector = ballPos.sub(shipPos)
        const line = new Line({
            start: Vector.Zero,
            end: lineVector,
            color: new Color(200, 200, 200, 0.8),
            thickness: 2
        })
        
        this.towLine.graphics.use(line)
        this.scene.add(this.towLine)
    }

    public update(shipPos: Vector, ballPos: Vector): void {
        if (!this.towLine || !this.scene) return
        
        // Update line position and direction
        this.towLine.pos = shipPos.clone()
        
        const lineVector = ballPos.sub(shipPos)
        const line = new Line({
            start: Vector.Zero,
            end: lineVector,
            color: new Color(200, 200, 200, 0.8),
            thickness: 2
        })
        
        this.towLine.graphics.use(line)
    }

    public hide(): void {
        if (this.towLine && this.scene) {
            this.towLine.kill()
            this.towLine = null
        }
    }

    public isVisible(): boolean {
        return this.towLine !== null
    }
}
