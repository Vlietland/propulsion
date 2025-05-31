import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';
import { HyperspaceView } from '@src/game/ui/hyperspaceView'

export const BALL = new ImageSource('/images/tiles/ball.png')
await BALL.load()

export class BallActor extends BaseActor {
    private mass = 100;

    constructor(object: TiledObject) {     
        super(object, BALL, CollisionType.Active)
        if (object && object.properties) {
            if (object.properties instanceof Map) {
                this.mass = Number(object.properties.get('mass') || 100)
            }
        }
    }

    onInitialize(engine: Engine): void {
        this.on('postcollision', (evt) => this.explode())
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

    public enterHyperspace(): void {
        this.kill
        HyperspaceView.spawn(this.scene, this.pos, 0);        
    }
}
