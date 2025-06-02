import { Actor, CollisionType, Engine, ImageSource, Vector, CollisionStartEvent, Timer, Scene } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor'
import { TiledObject, TiledProperty } from '@excalibur-tiled/index'
import { Explosion } from '@src/game/ui/explosion'
import { SoundManager } from '@src/game/engine/soundManager'

export const BULLET = new ImageSource('/images/tiles/bullet.png')
BULLET.load()

export class BulletActor extends BaseActor {
    private static readonly SPEED = 300
    private static readonly LIFETIME = 3000
    private firer: Actor
    private lifetimeTimer?: Timer

    constructor(pos: Vector, direction: Vector, firer: Actor) {
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
        this.firer = firer        
        this.vel = direction.normalize().scale(BulletActor.SPEED)
        this.rotation = direction.toAngle()        
        this.graphics.use(BULLET.toSprite())
        this.z = -1
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine)
        this.on('postcollision', (evt) => this.onCollision(evt as CollisionStartEvent))
        this.lifetimeTimer = new Timer({
            fcn: () => { if (!this.isKilled()) this.kill() },
            interval: BulletActor.LIFETIME,
            repeats: false
        })
        engine.currentScene.add(this.lifetimeTimer)
        this.lifetimeTimer.start()
    }

    onPreKill(scene: Scene): void {
        if (this.lifetimeTimer) {
            this.lifetimeTimer.stop()
            if (scene) scene.remove(this.lifetimeTimer)
            else if (this.scene) this.scene.remove(this.lifetimeTimer)
            this.lifetimeTimer = undefined
        }
        super.onPreKill(scene)
    }

    private onCollision(evt: CollisionStartEvent): void {
        const otherActor = evt.other?.owner
        if (otherActor === this.firer) return
        Explosion.spawnSmall(this.scene, this.pos)
        SoundManager.playBulletHit()
        this.kill()
    }

    public getFirer(): Actor {
        return this.firer
    }
}