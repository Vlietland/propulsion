import { TiledObject } from '@excalibur-tiled/index'
import { Engine, CollisionType, Vector, ImageSource, Timer, Scene, CollisionStartEvent, Sound } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { BulletActor } from './bulletActor';
import { ScoreManager } from '@src/scoreManager';
import { SoundManager } from '@src/game/engine/soundManager'
import { getImagePath } from '@src/utils/assetPaths';

export const TURRET = new ImageSource(getImagePath('tiles/turret.png'));
await TURRET.load();

const TURRET_FIRE_INTERVAL = 5000;
const TURRET_BULLET_OFFSET = 80;
const DESTRUCTION_SCORE = 500;

export class TurretActor extends BaseActor {
    private fireTimer!: Timer;
    private fireRate: number = 99999;
    private scoreManager: ScoreManager;

    constructor(object: TiledObject, enemyLevel: number, scoreManager: ScoreManager) {
        super(object, TURRET, CollisionType.Fixed);
        this.scoreManager = scoreManager;
        if (enemyLevel > 0) this.fireRate = TURRET_FIRE_INTERVAL / enemyLevel;
    }

    onInitialize(engine: Engine): void {
        super.onInitialize(engine);
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent))
        
        this.fireTimer = new Timer({
            fcn: () => this.fire(engine),
            interval: this.fireRate,
            repeats: true
        })
        engine.currentScene.add(this.fireTimer)

        const randomDelay = Math.random() * this.fireRate        
        setTimeout(() => {if (!this.isKilled()) this.fireTimer.start() }, randomDelay)
    }

    private fire(engine: Engine): void {
        const randomAngleOffset = Math.random() * Math.PI;
        const bulletAngle = this.rotation + Math.PI + randomAngleOffset;
        const direction = Vector.fromAngle(bulletAngle);
        const bulletStartPosition = this.pos.add(direction.scale(TURRET_BULLET_OFFSET));
        const bullet = new BulletActor(bulletStartPosition, direction, this);
        engine.currentScene.add(bullet);
        SoundManager.playTurretGun()
        this.fireTimer.interval = this.fireRate * 0.7 + Math.random() * 0.6 // Range: 0.7-1.3 (±30%)
    }

    onPreKill(scene: Scene): void {
        if (this.fireTimer) {
            this.fireTimer.stop();
            if (scene) scene.remove(this.fireTimer)
        }
        super.onPreKill(scene);
    }

    private handleCollision (evt: CollisionStartEvent) : void { 
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() instanceof TurretActor) return
        }
        SoundManager.playActorExplosion();
        this.explode();
        this.scoreManager.addScore(DESTRUCTION_SCORE);
    }
}
