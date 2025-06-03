import { Scene, Vector, Color, Actor, Line, GraphicsGroup, Polygon } from 'excalibur'

export class TowLineView {
    private towLine: Actor | null = null
    private scene: Scene | null = null

    constructor(scene: Scene | null) { this.scene = scene }

    public show(shipPos: Vector, ballPos: Vector): void {
        if (!this.scene) return
        this.hide()
        this.towLine = new Actor({
            pos: shipPos.clone(),
            anchor: Vector.Zero,
            z: -1
        })
        this.towLine.graphics.use(this.createLine(shipPos, ballPos))
        this.scene.add(this.towLine)
    }

    public update(shipPos: Vector, ballPos: Vector): void {
        if (!this.towLine || !this.scene) return
        this.towLine.pos = shipPos.clone()
        this.towLine.graphics.use(this.createLine(shipPos, ballPos))
    }

    public hide(): void {
        if (this.towLine && this.scene) {
            console.log('Hiding tow line')
            this.towLine.kill()
            this.towLine = null
        }
    }

    public isVisible(): boolean { return this.towLine !== null }

    private createLine(shipPos: Vector, ballPos: Vector): GraphicsGroup {
        const lineVector = ballPos.sub(shipPos)
        const distance = lineVector.distance()
        const alpha = Math.max(0.4, Math.min(0.9, 1 - distance / 800))
        const thickness = Math.max(1, Math.min(4, 6 - distance / 200))
        
        const glowLine = new Line({
            start: Vector.Zero,
            end: lineVector,
            color: new Color(100, 200, 255, alpha * 0.7),
            thickness: thickness * 3
        })
        
        const mainLine = new Line({
            start: Vector.Zero,
            end: lineVector,
            color: new Color(100, 200, 255, alpha * 0.3),
            thickness: thickness
        })
        
        return new GraphicsGroup({
            members: [
                { graphic: glowLine, offset: Vector.Zero },
                { graphic: mainLine, offset: Vector.Zero }
            ]
        })
    }
}
