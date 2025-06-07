import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource, CollisionStartEvent, Engine, Timer, Scene } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { ScoreManager } from '@src/scoreManager';
import { SoundManager } from '@src/game/engine/soundManager';
import { BulletActor } from '@src/game/actors/bulletActor';
import { TurretActor } from './turretActor';
import { getImagePath } from '@src/utils/assetPaths';

export const REACTOR = new ImageSource(getImagePath('tiles/reactor.png'));
REACTOR.load();

const ARMOR = 1000;
const DESTRUCTION_SCORE = 2000;
const BULLET_DAMAGE = 50
const DESTROY_DELAY = 10000;

export class ReactorActor extends BaseActor {
    private scoreManager: ScoreManager;
    private armor: number = ARMOR;
    private destroyTimer?: Timer;
    private alarmTimer?: Timer;
    private onExplodeCallback?: () => void;

    constructor(object: TiledObject, scoreManager: ScoreManager) {
        super(object, REACTOR, CollisionType.Fixed);
        this.scoreManager = scoreManager;
    }

    onInitialize(engine: Engine): void {
        super.onInitialize(engine);
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent));
    }

    setOnExplode(callback: () => void): void {
        this.onExplodeCallback = callback;
    }

    private handleCollision(evt: CollisionStartEvent): void {
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() instanceof TurretActor) return;
        }
        this.armor -= BULLET_DAMAGE;
        if (this.armor <= 0 && !this.destroyTimer) {
            this.startDestructionTimer();
        }
    }

    private startDestructionTimer(): void {
        this.destroyTimer = new Timer({
            fcn: () => this.explode(),
            interval: DESTROY_DELAY,
            repeats: false
        });
        this.scene?.engine.add(this.destroyTimer);
        this.destroyTimer.start();

        this.alarmTimer = new Timer({
            fcn: () => SoundManager.playAlarm(),
            interval: 1000,
            repeats: true
        });
        this.scene?.engine.add(this.alarmTimer);
        this.alarmTimer.start();
    }

    protected explode(): void {
        this.scoreManager.addScore(DESTRUCTION_SCORE);
        
        if (this.alarmTimer) {
            this.alarmTimer.stop();
            this.scene?.engine.remove(this.alarmTimer);
        }
        
        super.explode()
        if (this.onExplodeCallback) {
            this.onExplodeCallback();
        }
    }

    isDestructionTimerSet(): boolean {
        return !!this.destroyTimer;
    }
}
