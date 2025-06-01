import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource, CollisionStartEvent, Engine, Timer, Scene } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { ScoreManager } from '@src/game/engine/scoreManager';
import { BulletActor } from '@src/game/actors/bulletActor';
import { TurretActor } from './turretActor';

export const REACTOR = new ImageSource('/images/tiles/reactor.png');
await REACTOR.load();

const ARMOR = 1000;
const DESTRUCTION_SCORE = 1000;
const BULLET_DAMAGE = 50
const DESTROY_DELAY = 5000;

export class ReactorActor extends BaseActor {
    private scoreManager: ScoreManager;
    private armor: number = ARMOR;
    private destroyTimer?: Timer;
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
            console.log('timer set')
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
    }

    protected explode(): void {
        console.log('Reactor exploded!');
        this.scoreManager.addScore(DESTRUCTION_SCORE);
        super.explode()
        if (this.onExplodeCallback) {
            this.onExplodeCallback();
        }
    }

    isDestructionTimerSet(): boolean {
        return !!this.destroyTimer;
    }
}
