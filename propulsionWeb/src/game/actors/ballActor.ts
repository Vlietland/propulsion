import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, Engine, ImageSource, CollisionStartEvent } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';
import { HyperspaceView } from '@src/game/ui/hyperspaceView'
import { Hyperspace } from '@src/game/physics/hyperspace'

export const BALL = new ImageSource('/images/tiles/ball.png')
await BALL.load()

export class BallActor extends BaseActor {
    private mass = 100;
    private hyperspace?: Hyperspace
    private inHyperspace = false

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

    getMass(): number {
        return this.mass
    }

    getPos(): Vector {
        return this.pos
    }

    addPos(pos: Vector) {
        this.pos = this.pos.add(pos)
    }

    public explode(): void {
        super.explode()
    }    

    public requestHyperspace(): void {
        if (this.inHyperspace) return
        this.inHyperspace = true        
        this.kill()
        HyperspaceView.spawn(this.scene, this.pos, new Vector(0, 0));        
    }

    public setHyperspace(hyperspace: Hyperspace): void {
        this.hyperspace = hyperspace
    }

    private handleCollision(evt: CollisionStartEvent): void {
        if (this.hyperspace?.checkHyperspaceReached(this as any)) {
            this.requestHyperspace()
        } else {
            this.explode()
        }
    }
}
