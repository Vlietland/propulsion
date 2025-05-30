import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource, Actor, Scene, Engine, Ray } from 'excalibur';
import { LaserBeamActor, LASER_BEAM } from '@src/game/actors/laserBeamActor';
import { BaseActor } from '@src/game/actors/baseActor';

export const LASER = new ImageSource('/images/tiles/laser.png');
await LASER.load();

export class LaserActor extends BaseActor {
    private laserBeams: LaserBeamActor[] = [];
    private directionVector: Vector
    private readonly MAX_BEAMS = 6
    private object: TiledObject

    constructor(object: TiledObject) {
        super(object, LASER, CollisionType.Fixed)
        this.object = object
        // Convert object rotation from degrees to radians for proper direction calculation
        const rotationRad = object.rotation !== undefined ? (object.rotation * Math.PI / 180) : this.rotation
        this.directionVector = this.calcDirectionVector(rotationRad)
    }

    onInitialize(engine: Engine): void {
        this.startlaser(this.object)
    }

    private startlaser(object: TiledObject): void {
        if (object.x === undefined || object.y === undefined || 
            object.width === undefined || object.height === undefined) return        
        if (this.laserBeams.length != 0) return

        const tileWidth = object.width
        const tileHeight = object.height        
        let beamCount = 0
        
        const startPos = new Vector(object.x, object.y)
        let currentBeamPos = startPos.add(this.directionVector.scale(tileWidth))
        
        while (!this.isPositionBlocked(currentBeamPos) && beamCount < this.MAX_BEAMS) {
            const beamObject: TiledObject = {
                id: 0,
                name: 'laserbeam',
                type: '',
                visible: true,
                x: currentBeamPos.x,
                y: currentBeamPos.y,
                width: LASER_BEAM.width,
                height: LASER_BEAM.height,
                rotation: this.rotation,
                gid: 0
            }
            const beam = new LaserBeamActor(beamObject);
            beam.rotation = this.rotation
            this.laserBeams.push(beam);
            this.scene?.add(beam)
            
            currentBeamPos = currentBeamPos.add(this.directionVector.scale(tileWidth))
            beamCount++;
        }
    }

    public stopLaser(): void {
        for (const beam of this.laserBeams) {
            if (beam.scene) {
                beam.kill()
                beam.scene.remove(beam)
            }
        }
        this.laserBeams = []
    }

    private calcDirectionVector(rotation: number): Vector {
        let directionVector = new Vector(Math.cos(rotation), Math.sin(rotation));
        if (this.flip) directionVector = new Vector(directionVector.x, -directionVector.y);
        return directionVector.normalize();
    }

    private isPositionBlocked(position: Vector): boolean {
        if (!this.scene) return true
        
        if (position.x < 0 || position.y < 0 || position.x > 10000 || position.y > 10000) {
            return true
        }
        
        const actors = this.scene.actors
        for (const actor of actors) {
            if (actor === this || actor instanceof LaserBeamActor) continue
            
            if (actor instanceof BaseActor) {
                if (actor.body.collisionType === CollisionType.Fixed || 
                    actor.body.collisionType === CollisionType.Active) {
                    if (actor.contains(position.x, position.y)) {
                        return true
                    }
                }
            }
        }
        
        return false
    }
}
