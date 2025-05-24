import { Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
export const BALL = new ImageSource('/images/tiles/ball.png')
await BALL.load()

export class BallActor extends Actor {
    private mass

    constructor(pos: Vector, mass: number) {
        super({
            pos: pos,
            width: BALL.width,
            height: BALL.height,
            collisionType: CollisionType.Passive,
        })
        this.pos = pos
        this.mass = mass
        this.graphics.use(BALL.toSprite())
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
