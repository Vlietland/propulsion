import { Actor, CollisionType, Vector } from 'excalibur';

export class ReactorActor extends Actor {
  constructor(options: { pos: Vector; width: number; height: number; collisionType: CollisionType }) {
    super(options);
  }
}
