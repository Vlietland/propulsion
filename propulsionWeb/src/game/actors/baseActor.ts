import { Actor, Vector, CollisionType, ImageSource } from 'excalibur';
import { TiledObject } from '@excalibur-tiled/index';

export class BaseActor extends Actor {
    constructor(object: TiledObject, image: ImageSource, collisionType: CollisionType = CollisionType.Passive) {
        if (!object || object.x === undefined || object.y === undefined || object.rotation === undefined || object.gid === undefined) {
            throw new Error("Invalid TiledObject provided to BaseActor: x, y, rotation, or gid is undefined");
        }
        let correction = Vector.Zero
        if (object.rotation == -90) correction.x = -128
        if (object.rotation == 90) correction.y = 128
        super({
            pos: new Vector(object.x+64, object.y-64).add(correction),
            width: image.width,
            height: image.height,
            collisionType: collisionType,
        });
        this.rotation = object.rotation * (Math.PI / 180);
        if ((object.gid & 0x40000000) !== 0) this.scale.y = -this.scale.y;
        this.graphics.use(image.toSprite());
    }
}
