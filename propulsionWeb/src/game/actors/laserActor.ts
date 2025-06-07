import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource, Actor, Scene, Engine, Ray } from 'excalibur';
import { LaserBeamActor, LASER_BEAM } from '@src/game/actors/laserBeamActor';
import { BaseActor } from '@src/game/actors/baseActor';
import { getImagePath } from '@src/utils/assetPaths';

export const LASER = new ImageSource(getImagePath('tiles/laser.png'));
LASER.load();

export class LaserActor extends BaseActor {
    private laserBeams: LaserBeamActor[] = [];
    private directionVector: Vector
    private readonly MAX_BEAMS = 6
    private object: TiledObject
    private groupID: number | undefined = undefined
    private enableTimer: number = 0
    private disableDelay: number = 5000

    constructor(object: TiledObject) {
        super(object, LASER, CollisionType.Fixed)
        this.object = object
        const rotationRad = object.rotation !== undefined ? (object.rotation * Math.PI / 180) : this.rotation
        this.directionVector = this.calcDirectionVector(rotationRad)
        if (object && object.properties) {
            if (object.properties instanceof Map) {
                this.groupID = Number(object.properties.get('group'))
                this.disableDelay = Number(object.properties.get('delay')) * 1000 || 5000               
            }
        }

    }

    onInitialize(engine: Engine): void {
        if (this.enableTimer) {
            clearTimeout(this.enableTimer)
            this.enableTimer = 0
        }
        this.enable(this.object)
    }

    public disable(): void {
        for (const beam of this.laserBeams) {
            if (beam.scene) {
                beam.kill()
                beam.scene.remove(beam)
            }
        }
        this.laserBeams = []
        this.enableAfterDelay()
    }

    public getGroupID(): number | undefined { return this.groupID}
    
    public enableAfterDelay(delay: number = this.disableDelay): void {
        if (this.enableTimer) clearTimeout(this.enableTimer)
        this.enableTimer = window.setTimeout(() => {
            if (this.scene) this.enable(this.object)
        }, delay)
    }
    
    public enableNow(): void {
        if (this.enableTimer) {
            clearTimeout(this.enableTimer)
            this.enableTimer = 0
        }
        this.enable(this.object)
    }

    private enable(object: TiledObject): void {
        if (object.x === undefined || object.y === undefined || 
            object.width === undefined || object.height === undefined) return        
        if (this.laserBeams.length != 0) return

        const tileWidth = object.width
        const tileHeight = object.height        
        let beamCount = 0
        
        const laserPos = new Vector(object.x, object.y)
        let currentBeamPos = laserPos.add(this.directionVector.scale(tileWidth))

        while (beamCount < this.MAX_BEAMS) {
            const correctedPos = this.correctPosition(currentBeamPos, this.rotation, LASER_BEAM)
            const beamObject: TiledObject = {
                id: 0,
                name: 'laserbeam',
                type: '',
                visible: true,
                x: correctedPos.x,
                y: correctedPos.y,
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

    private calcDirectionVector(rotation: number): Vector {
        let directionVector = new Vector(Math.cos(rotation), Math.sin(rotation));
        if (this.flip) directionVector = new Vector(directionVector.x, -directionVector.y);
        return directionVector.normalize();
    }

    private correctPosition(position: Vector, rotation: number, image: ImageSource): Vector {
        const correction: Vector = Vector.Zero;
        if (rotation === Math.PI / 2) correction.y = image.height
        else if (rotation === 3 * Math.PI / 2) correction.x = -image.width
        else if (rotation === Math.PI) { correction.x = -image.width; correction.y = image.height }
        return position.add(correction);
    }
}
