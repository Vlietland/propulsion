import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';

export const TRANSFORMER = new ImageSource('/images/tiles/transformer.png');
await TRANSFORMER.load();

export class TransformerActor extends Actor {
    constructor(pos: Vector) {
        super({
            pos: pos,
            width: TRANSFORMER.image.width, // Dynamically derived from the image
            height: TRANSFORMER.image.height, // Dynamically derived from the image
            collisionType: CollisionType.Fixed,
        });
        this.graphics.use(TRANSFORMER.toSprite());
    }
}