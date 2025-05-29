import { Actor, Color, Vector, CollisionType, ImageSource } from 'excalibur';
import { TiledObject } from '@excalibur-tiled/index';
import { CollisionPoints } from '@src/game/physics/collision/collisionPoints'

export class BaseActor extends Actor {
    protected flip : boolean = false
    protected collisionPoints: Vector[] = []
    private COLLISION_DEBUG = true

    constructor(object: TiledObject, image: ImageSource, collisionType: CollisionType = CollisionType.Passive) {
        if (!object || object.x === undefined || object.y === undefined || object.rotation === undefined || object.gid === undefined) {
            throw new Error("Invalid TiledObject provided to BaseActor: x, y, rotation, or gid is undefined");
        }
        let correction = Vector.Zero
        if (object.rotation == -90) correction.x = -image.width
        if (object.rotation == 90) correction.y = image.height
        super({
            pos: new Vector(object.x+64, object.y-64).add(correction),
            width: image.width,
            height: image.height,
            collisionType: collisionType,
        });
        this.rotation = object.rotation * (Math.PI / 180);
        if ((object.gid & 0x40000000) !== 0)
            {
                this.flip = true
                this.scale.y = -this.scale.y;
            }
        this.generateCollisionPoints(image, 16)
        if (this.COLLISION_DEBUG) this.collisionDraw()
        this.graphics.use(image.toSprite())
    }
    
    protected generateCollisionPoints(image: ImageSource, count = 8) {
        this.collisionPoints = CollisionPoints.getCollisionPoints(image, count)
    }    

    private collisionDraw() {
        this.graphics.onPostDraw = (ctx) => {
            for (const p of this.collisionPoints) {
                let collisionPoint = new Vector(p.x - this.width / 2, p.y - this.height / 2)
                if (this.flip) collisionPoint = collisionPoint.add(new Vector(0, -this.height))
                ctx.drawCircle(collisionPoint, 2, Color.Red)
            }
        }
    }
}
