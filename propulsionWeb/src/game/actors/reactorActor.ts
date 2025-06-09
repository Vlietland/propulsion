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
    private destructionTimer?: Timer;
    private onExplodeCallback?: () => void;
    private timerObservers: Array<(timeRemaining: number) => void> = [];
    private secondsRemaining: number = 0;

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
        if (this.armor <= 0 && !this.destructionTimer) {
            this.startDestructionTimer();
        }
    }

    private startDestructionTimer(): void {
        this.secondsRemaining = DESTROY_DELAY / 1000; // Convert to seconds
        this.destructionTimer = new Timer({
            fcn: () => {
                SoundManager.playAlarm();
                this.notifyTimerObservers(this.secondsRemaining);
                this.secondsRemaining--;
                if (this.secondsRemaining <= 0) this.explode()
            },
            interval: 1000,
            repeats: true
        });
        this.scene?.engine.add(this.destructionTimer);
        this.destructionTimer.start();
    }

    protected explode(): void {
        this.scoreManager.addScore(DESTRUCTION_SCORE);
        
        if (this.destructionTimer) {
            this.destructionTimer.stop();
            this.scene?.engine.remove(this.destructionTimer);
        }
        
        super.explode()
        if (this.onExplodeCallback) {
            this.onExplodeCallback();
        }
    }

    isDestructionTimerSet(): boolean {
        return !!this.destructionTimer;
    }

    addTimerObserver(observer: (timeRemaining: number) => void): void {
        this.timerObservers.push(observer);
    }

    removeTimerObserver(observer: (timeRemaining: number) => void): void {
        const index = this.timerObservers.indexOf(observer);
        if (index > -1) {
            this.timerObservers.splice(index, 1);
        }
    }

    private notifyTimerObservers(timeRemaining: number): void {
        this.timerObservers.forEach(observer => observer(timeRemaining));
    }
}
