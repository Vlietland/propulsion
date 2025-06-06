import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, CollisionStartEvent, ImageSource, Engine } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor'
import { LaserActor } from '@src/game/actors/laserActor'
import { BulletActor } from '@src/game/actors/bulletActor';
import { TurretActor } from '@src/game/actors/turretActor'

export const TRANSFORMER = new ImageSource('/publish/images/tiles/transformer.png')
await TRANSFORMER.load()

export class TransformerActor extends BaseActor {
    private groupID: number | undefined = undefined
    private connectedLaser: LaserActor | null = null

    constructor(object: TiledObject) {
        super(object, TRANSFORMER, CollisionType.Fixed)        
        if (object?.properties instanceof Map) {
            this.groupID = Number(object.properties.get('group')) || 0
        }
    }

    onInitialize(engine: Engine): void {
        super.onInitialize(engine);
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent))
    }

    public getGroupID(): number | undefined { return this.groupID }
    public setLaser(laser: LaserActor): void { this.connectedLaser = laser }

    private handleCollision (evt: CollisionStartEvent) : void { 
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() instanceof TurretActor) return
        }
        if (this.connectedLaser) {
            this.connectedLaser.disable()
        }
    }    
}