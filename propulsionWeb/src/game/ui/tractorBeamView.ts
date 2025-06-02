import { Scene, Vector, Color, Circle, Actor, Line, Rectangle, Polygon } from 'excalibur'

export class TractorBeamView {
    private static activeBeam: Actor | null = null

    public static spawnActivationRing(scene: Scene | null, shipPos: Vector) {
        if (!scene) return
        const ring = new Actor({ pos: shipPos.clone(), anchor: Vector.Half})
        let radius = 15
        const circle = new Circle({
            radius: radius,
            color: Color.Transparent,
            strokeColor: new Color(100, 200, 255),
            lineWidth: 2
        })
        ring.graphics.use(circle)
        ring.graphics.opacity = 0.8
        let life = 20
        ring.on('preupdate', () => {
            radius += 4
            circle.radius = radius
            ring.graphics.opacity *= 0.93
            life--
            if (life <= 0) ring.kill()
        })
        scene.add(ring)
    }

    public static spawn(scene: Scene | null, shipPos: Vector, targetPos: Vector, beamWidth: number = 100, beamReach: number = 220) {
        if (!scene || TractorBeamView.activeBeam) return
        const beamField = new Actor({
            pos: new Vector(shipPos.x, shipPos.y + beamReach / 2),
            anchor: Vector.Half
        })
        const topWidth = beamWidth * 0.3
        const bottomWidth = beamWidth
        const halfHeight = beamReach / 2
        const trapezoidPoints = [
            new Vector(-topWidth / 2, -halfHeight),
            new Vector(topWidth / 2, -halfHeight),
            new Vector(bottomWidth / 2, halfHeight),
            new Vector(-bottomWidth / 2, halfHeight)
        ]
        const beamTrapezoid = new Polygon({
            points: trapezoidPoints,
            color: new Color(100, 200, 255, 40),
            strokeColor: Color.Transparent,
            lineWidth: 0
        })
        beamField.graphics.use(beamTrapezoid)
        beamField.graphics.opacity = 0.5
        let life = 2
        TractorBeamView.activeBeam = beamField
        beamField.on('preupdate', () => {
            beamField.graphics.opacity *= 0.88
            life--
            if (life <= 0) {
                beamField.kill()
                TractorBeamView.activeBeam = null
            }
        })
        scene.add(beamField)
    }   
}