import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';

export const TURRET = new ImageSource('/images/tiles/turret.png');
await TURRET.load();

export class TurretActor extends Actor {
    constructor(pos: Vector) {
        super({
            pos: pos,
            width: TURRET.image.width, // Dynamically derived from the image
            height: TURRET.image.height, // Dynamically derived from the image
            collisionType: CollisionType.Fixed,
        });
        this.graphics.use(TURRET.toSprite());
    }
}
