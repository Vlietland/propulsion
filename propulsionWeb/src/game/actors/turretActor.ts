import { TiledObject } from '@excalibur-tiled/index'
import { Engine, CollisionType, Vector, ImageSource, Timer, Scene, CollisionStartEvent } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { BulletActor } from './bulletActor';
CollisionStartEvent
export const TURRET = new ImageSource('/images/tiles/turret.png');
await TURRET.load();

const TURRET_FIRE_INTERVAL = 1000;
const TURRET_BULLET_OFFSET = 80;

export class TurretActor extends BaseActor {
    private fireTimer!: Timer;

    constructor(object: TiledObject) {
        super(object, TURRET, CollisionType.Fixed);
    }

    onInitialize(engine: Engine): void {
        super.onInitialize(engine);
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent))

        this.fireTimer = new Timer({
            fcn: () => this.fire(engine),
            interval: TURRET_FIRE_INTERVAL,
            repeats: true
        })
        engine.currentScene.add(this.fireTimer);
        this.fireTimer.start();
    }

    private fire(engine: Engine): void {
        const randomAngleOffset = Math.random() * Math.PI;
        const bulletAngle = this.rotation + Math.PI + randomAngleOffset;
        const direction = Vector.fromAngle(bulletAngle);
        const bulletStartPosition = this.pos.add(direction.scale(TURRET_BULLET_OFFSET));
        const bullet = new BulletActor(bulletStartPosition, direction, this);
        engine.currentScene.add(bullet);
    }

    onPreKill(scene: Scene): void {
        if (this.fireTimer) {
            this.fireTimer.stop();
            if (scene) {
                scene.remove(this.fireTimer);
            }
        }
        super.onPreKill(scene);
    }

    private handleCollision (evt: CollisionStartEvent) : void { 
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() instanceof TurretActor) return
        }
        this.explode();
    }
}
