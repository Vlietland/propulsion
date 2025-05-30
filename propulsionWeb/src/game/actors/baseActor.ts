import { Actor, Color, Vector, CollisionType, ImageSource, Shape } from 'excalibur'
import { TiledObject } from '@excalibur-tiled/index'
import { CollisionPoints } from '@src/game/physics/collision/collisionPoints'

export class BaseActor extends Actor {
    protected flip : boolean = false
    protected collisionPoints: Vector[] = []
    private COLLISION_DEBUG = true
    private originalPolygonPoints: Vector[] = []

    constructor(object: TiledObject, image: ImageSource, collisionType: CollisionType = CollisionType.Passive) {
        if (!object || object.x === undefined || object.y === undefined || object.rotation === undefined || object.gid === undefined) {
            throw new Error("Invalid TiledObject provided to BaseActor: x, y, rotation, or gid is undefined")
        }
        let correction = Vector.Zero
        if (object.rotation == -90) correction.x = -image.width
        if (object.rotation == 90) correction.y = image.height
        super({
            pos: new Vector(object.x+image.width/2, object.y-image.height/2).add(correction),
            //width: image.width,
            //height: image.height,
            collisionType: collisionType,
        })
        this.rotation = object.rotation * (Math.PI / 180)
        this.generateCollisionPoints(image, 24)
        if ((object.gid & 0x40000000) !== 0) {
            this.flip = true
            this.collisionPoints = this.collisionPoints.map(p =>
                new Vector(p.x, image.height - p.y)
            )
        }
        this.setupStableCollider(image)
        this.graphics.use(image.toSprite())
        if (this.COLLISION_DEBUG) this.collisionDraw(image)
    }
    
    private setupStableCollider(image: ImageSource) {
        if (this.collisionPoints.length >= 3) {
            this.originalPolygonPoints = this.collisionPoints.map(p =>
                new Vector(p.x - image.width / 2, p.y - image.height / 2)
            )
            const polygon = Shape.Polygon(this.originalPolygonPoints, Vector.Zero, true)
            this.collider.set(polygon)
            if (this.flip) {
                this.graphics.flipVertical = true
            }
        }
    }
    
    protected generateCollisionPoints(image: ImageSource, count = 8) {
        this.collisionPoints = CollisionPoints.getCollisionPoints(image, count)
    }    

    private collisionDraw(image?: ImageSource) {
        if (image === undefined) return
        this.graphics.onPostDraw = (ctx) => {
            const collider = this.collider.get()
            if (collider) {
                const polygon = collider as any
                if (polygon.points && polygon.points.length > 0) {
                    for (let i = 0; i < polygon.points.length; i++) {
                        const currentPoint = polygon.points[i]
                        const nextPoint = polygon.points[(i + 1) % polygon.points.length]
                        ctx.drawLine(currentPoint, nextPoint, Color.Red, 1)
                    }
                }
            }
        }
    }
}
