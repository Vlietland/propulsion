import { TiledObject } from '@excalibur-tiled/index'
import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';
import { LaserBeamActor } from '@src/game/actors/laserBeamActor';
import { BaseActor } from './baseActor';

export const LASER = new ImageSource('/images/tiles/laser.png');
await LASER.load();

export class LaserActor extends BaseActor {
    private activeLaserBeam: LaserBeamActor | null = null;
    private laserBeams: LaserBeamActor[] = [];

    constructor(object: TiledObject) {
        super(object, LASER, CollisionType.Passive);
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
