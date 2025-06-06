import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, Engine, ImageSource, CollisionStartEvent } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';
import { HyperspaceView } from '@src/game/ui/hyperspaceView'
import { ShipActor } from '@src/game/actors/ship/shipActor';
import { GameResult } from '@src/menu/gameManager'
import { Hyperspace } from '@src/game/physics/hyperspace'
import { BulletActor } from '@src/game/actors/bulletActor';
import { TurretActor } from '@src/game/actors/turretActor'
import { SoundManager } from '@src/game/engine/soundManager'

export const BALL = new ImageSource('/publish/images/tiles/ball.png')
await BALL.load()

export class BallActor extends BaseActor {
    private mass = 100;
    private hyperspace?: Hyperspace
    private inHyperspace = false
    private ship?: ShipActor

    constructor(object: TiledObject) {     
        super(object, BALL, CollisionType.Active)
        if (object && object.properties) {
            if (object.properties instanceof Map) {
                this.mass = Number(object.properties.get('mass') || 100)
            }
        }
    }

    onInitialize(engine: Engine): void {
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent))
    }

    public getMass(): number { return this.mass }
    public getPos(): Vector { return this.pos }
    public addPos(pos: Vector) { this.pos = this.pos.add(pos) }
    public explode(): void { super.explode() }
    public setHyperspace(hyperspace: Hyperspace) { this.hyperspace = hyperspace }
    public setShip(ship: ShipActor) { this.ship = ship}

    public requestHyperspace(): void {
        if (this.inHyperspace) return
        this.inHyperspace = true
        SoundManager.playHyperspace()
        this.kill()
        HyperspaceView.spawn(this.scene, this.pos, new Vector(0, 0))        
    }

    private handleCollision(evt: CollisionStartEvent): void {
        if (this.hyperspace?.checkHyperspaceReached(this)) {
            if (this.ship === undefined) return   
            this.ship.requestHyperspace(GameResult.ShipBallHyperspace)
            this.requestHyperspace()
        } else {
            const collidingActor = evt.other?.owner;            
            if (collidingActor instanceof BulletActor) {
                const bullet = collidingActor as BulletActor;
                if (bullet.getFirer() instanceof TurretActor && !this.ship) return
            }
            this.ship?.attachBall(undefined)
            SoundManager.playActorExplosion();
            this.explode()
        }
    }
}
