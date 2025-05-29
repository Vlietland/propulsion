import { TiledObject } from '@excalibur-tiled/index'
import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';
import { LaserBeamActor } from '@src/game/actors/laserBeamActor';
import { BaseActor } from './baseActor';

export const LASER = new ImageSource('/images/tiles/laser.png');
await LASER.load();

export class LaserActor extends BaseActor {
    private activeLaserBeam: LaserBeamActor | null = null;
    private laserBeams: LaserBeamActor[] = [];
    private laserRotation : number = 0

    constructor(object: TiledObject) {
        super(object, LASER, CollisionType.Passive);
        let rotationVector = new Vector(Math.cos(this.rotation), Math.sin(this.rotation));
        if (this.flip) rotationVector = new Vector(rotationVector.x, -rotationVector.y);
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
            beam.kill();
        }
    }

    startLaserBeam(): void {
        for (const beam of this.laserBeams) {
            beam.revive();
        }
    }
}
