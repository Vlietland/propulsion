import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';

export const REACTOR = new ImageSource('/images/tiles/reactor.png');
await REACTOR.load();

export class ReactorActor extends Actor {
    constructor(pos: Vector) {
        super({
            pos: pos,
            width: REACTOR.image.width, // Dynamically derived from the image
            height: REACTOR.image.height, // Dynamically derived from the image
            collisionType: CollisionType.Fixed,
        });
        this.graphics.use(REACTOR.toSprite());
    }
}
