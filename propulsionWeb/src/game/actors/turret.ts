import { Actor, CollisionType, Vector } from 'excalibur';

export class TurretActor extends Actor {
  constructor(options: { pos: Vector; width: number; height: number; collisionType: CollisionType }) {
    super(options);
  }

  onInitialize(): void {
    console.log('Turret initialized at position:', this.pos);
  }
}