import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';
import { LaserBeamActor } from '@src/game/actors/laserBeamActor';

export const LASER = new ImageSource('/images/tiles/laser.png');
await LASER.load();

export class LaserActor extends Actor {
    private activeLaserBeam: LaserBeamActor | null = null;
    private laserBeams: LaserBeamActor[] = [];

    constructor(pos: Vector) {
        super({
            pos: pos,
            width: LASER.image.width, // Dynamically derived from the image
            height: LASER.image.height, // Dynamically derived from the image
            collisionType: CollisionType.Passive,
        });
        this.graphics.use(LASER.toSprite());
    }

    fireLaserBeam(target: Vector): LaserBeamActor {
        const newBeam = new LaserBeamActor(this.pos.clone());
        newBeam.setTarget(target);
        newBeam.setSpeed(300);
        this.laserBeams.push(newBeam); // Add the new beam to the list
        this.scene?.add(newBeam); // Add the beam to the scene
        return newBeam;
    }

    stopLaserBeam(): void {
        for (const beam of this.laserBeams) {
            beam.kill(); // Make each laser beam invisible
        }
    }

    startLaserBeam(): void {
        for (const beam of this.laserBeams) {
            beam.revive(); // Make each laser beam visible again
        }
    }
}
