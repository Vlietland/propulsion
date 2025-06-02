import { Scene, Vector, Color, Circle, Actor, Line, Rectangle } from 'excalibur';

export class TractorBeamView {
    static spawn(scene: Scene | null, shipPos: Vector, targetPos: Vector, beamWidth: number = 100, beamReach: number = 220) {
        if (!scene) return;
        TractorBeamView.spawnSimpleBeam(scene, shipPos, beamWidth, beamReach);
        //TractorBeamView.spawnAttractionLine(scene, shipPos, targetPos);
    }

    private static spawnSimpleBeam(scene: Scene, shipPos: Vector, beamWidth: number, beamReach: number) {
        // Create a simple, lightweight beam field
        const beamField = new Actor({
            pos: new Vector(shipPos.x, shipPos.y + beamReach / 2),
            anchor: Vector.Half
        });

        const beamRect = new Rectangle({
            width: beamWidth,
            height: beamReach,
            color: new Color(100, 200, 255, 40), // Lighter transparency
            strokeColor: Color.Transparent, // No stroke for better performance
            lineWidth: 0
        });

        beamField.graphics.use(beamRect);
        beamField.graphics.opacity = 0.5;

        let life = 30; // Shorter duration

        beamField.on('preupdate', () => {
            // Simple fade out only
            beamField.graphics.opacity *= 0.96;
            
            life--;
            if (life <= 0) beamField.kill();
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