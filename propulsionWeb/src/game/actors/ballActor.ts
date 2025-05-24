
import { Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur';
export const BALL_IMAGE = new ImageSource('/images/energyBall.png');

export class BallActor extends Actor {
  private readonly mass = 1;

  constructor(options: {
    pos: Vector;
    width: number;
    height: number;
    collisionType: CollisionType;
  }) {
    super(options);
  }

    update(engine: Engine, delta: number) {

    }

    getMass(): number {
        return this.mass;
    }
}
