import { Scene, Vector, Color, Circle, Actor, Line, Rectangle, Polygon } from 'excalibur';

export class TractorBeamView {
    private static activeBeam: Actor | null = null;

    static spawn(scene: Scene | null, shipPos: Vector, targetPos: Vector, beamWidth: number = 100, beamReach: number = 220) {
        if (!scene) return;
        if (TractorBeamView.activeBeam) return
        TractorBeamView.spawnSimpleBeam(scene, shipPos, beamWidth, beamReach)
        TractorBeamView.spawnAttractionLine(scene, shipPos, targetPos)
    }

    private static spawnSimpleBeam(scene: Scene, shipPos: Vector, beamWidth: number, beamReach: number) {
        // Create a trapezoidal beam (narrow at top, wide at bottom)
        const beamField = new Actor({
            pos: new Vector(shipPos.x, shipPos.y + beamReach / 2),
            anchor: Vector.Half
        });

        // Create trapezoid points: narrow at top (ship), wide at bottom
        const topWidth = beamWidth * 0.3; // 30% of full width at top
        const bottomWidth = beamWidth; // Full width at bottom
        const halfHeight = beamReach / 2;

        const trapezoidPoints = [
            new Vector(-topWidth / 2, -halfHeight),     // Top left
            new Vector(topWidth / 2, -halfHeight),      // Top right
            new Vector(bottomWidth / 2, halfHeight),    // Bottom right
            new Vector(-bottomWidth / 2, halfHeight)    // Bottom left
        ];

        const beamTrapezoid = new Polygon({
            points: trapezoidPoints,
            color: new Color(100, 200, 255, 15), // Very transparent
            strokeColor: Color.Transparent,
            lineWidth: 0
        });

        beamField.graphics.use(beamTrapezoid);
        beamField.graphics.opacity = 0.25; // Lower base opacity

        let life = 8; // Much shorter duration for fluid movement
        
        // Set as active beam
        TractorBeamView.activeBeam = beamField;

        beamField.on('preupdate', () => {
            // Faster fade out for quicker refresh
            beamField.graphics.opacity *= 0.88;
            
            life--;
            if (life <= 0) {
                beamField.kill();
                TractorBeamView.activeBeam = null; // Clear active beam when done
            }
        });

        scene.add(beamField);
    }

    private static spawnAttractionLine(scene: Scene, shipPos: Vector, targetPos: Vector) {
        // Single attraction line instead of multiple
        const line = new Actor({
            pos: shipPos.clone(),
            anchor: Vector.Zero
        });

        const lineGraphic = new Line({
            start: Vector.Zero,
            end: targetPos.sub(shipPos),
            color: new Color(255, 255, 100, 120),
            thickness: 2
        });

        line.graphics.use(lineGraphic);
        line.graphics.opacity = 0.7;

        let life = 15; // Short duration

        line.on('preupdate', () => {
            // Simple fade out
            line.graphics.opacity *= 0.92;
            
            life--;
            if (life <= 0) line.kill();
        });

        scene.add(line);
    }

    static spawnActivationRing(scene: Scene | null, shipPos: Vector) {
        if (!scene) return;

        const ring = new Actor({
            pos: shipPos.clone(),
            anchor: Vector.Half
        });

        let radius = 15;
        const circle = new Circle({
            radius: radius,
            color: Color.Transparent,
            strokeColor: new Color(100, 200, 255),
            lineWidth: 2
        });

        ring.graphics.use(circle);
        ring.graphics.opacity = 0.8;

        let life = 20; // Shorter duration

        ring.on('preupdate', () => {
            radius += 4; // Slower growth
            circle.radius = radius;
            ring.graphics.opacity *= 0.93;
            life--;
            if (life <= 0) ring.kill();
        });

        scene.add(ring);
    }
}