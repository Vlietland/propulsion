import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';

export const BALL = new ImageSource('/images/tiles/ball.png')
await BALL.load()

export class BallActor extends BaseActor {
    private mass = 100;

    constructor(object: TiledObject, mass: number) {
        super(object, BALL, CollisionType.Passive);
        this.mass = mass;
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
}
