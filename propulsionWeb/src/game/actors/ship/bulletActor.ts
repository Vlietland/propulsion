import { Actor, CollisionType, Engine, ImageSource, Vector, CollisionStartEvent } from 'excalibur'
import { BaseActor } from '../baseActor'
import { TiledObject, TiledProperty } from '@excalibur-tiled/index'
import { ShipActor } from './shipActor'

export const BULLET = new ImageSource('/images/tiles/bullet.png')
BULLET.load()

export class BulletActor extends BaseActor {
    private static readonly SPEED = 200

    constructor(pos: Vector, direction: Vector) {
        const object: TiledObject = {
            name: 'bullet',
            x: pos.x,
            y: pos.y,
            width: 5,
            height: 5,
            gid: 0,
            rotation: 0,
            visible: true,
            properties: [] as TiledProperty[]
        }
        super(object, BULLET, CollisionType.Active)
        this.vel = direction.normalize().scale(BulletActor.SPEED)
        this.rotation = direction.toAngle()        
        this.graphics.use(BULLET.toSprite())
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
        this.on('postcollision', (evt) => this.onCollision(evt as CollisionStartEvent))
    }

    private onCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof BulletActor || evt.other instanceof ShipActor) {
            return
        }
        this.kill()
    }
}