
import { Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur';
export const BALL = new ImageSource('/images/energyBall.png');
await BALL.load()

export class BallActor extends Actor {
  private mass = 0;

  constructor(pos: Vector, mass: number) {
    super({pos: pos, width: BALL.width, height: BALL.height, collisionType: CollisionType.Passive})
    this.pos = pos
    this.mass = mass
    this.graphics.use(BALL.toSprite())
  }

  getMass(): number {
      return this.mass;
  }
}
