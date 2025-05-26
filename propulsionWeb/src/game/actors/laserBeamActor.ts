import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';

export const LASER_BEAM = new ImageSource('/images/tiles/laserbeam.png');
await LASER_BEAM.load();

export class LaserBeamActor extends Actor {
    public target: Vector;
    public speed: number;

    constructor(pos: Vector) {
        super({
            pos: pos,
            width: LASER_BEAM.image.width, // Dynamically derived from the image
            height: LASER_BEAM.image.height, // Dynamically derived from the image
            collisionType: CollisionType.Passive,
        });
        this.graphics.use(LASER_BEAM.toSprite());
        this.target = new Vector(0, 0); // Default initialization
        this.speed = 0; // Default initialization
    }

    public setTarget(target: Vector): void {
        this.target = target;
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public revive(): void {
        this.graphics.opacity = 1; // Make the laser beam fully visible
        this.actions.clearActions(); // Ensure the actor is active
    }

    onPreUpdate(engine: ex.Engine, delta: number): void {
        const direction = this.target.sub(this.pos).normalize();
        const movement = direction.scale(this.speed * (delta / 1000));
        this.pos = this.pos.add(movement);

        // Remove the laser beam if it reaches the target
        if (this.pos.distance(this.target) < 5) {
            this.kill();
        }
    }
}
