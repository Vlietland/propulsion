import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, CollisionStartEvent, ImageSource } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';
import { ScoreManager } from '@src/scoreManager';
import { BulletActor } from '@src/game/actors/bulletActor';
import { TurretActor } from '@src/game/actors/turretActor';
import { SoundManager } from '@src/game/engine/soundManager'
import { getImagePath } from '@src/utils/assetPaths';

export const FUEL_TANK_FULL = new ImageSource(getImagePath('tiles/fuelTankFull.png'))
export const FUEL_TANK_EMPTY = new ImageSource(getImagePath('tiles/fuelTankEmpty.png'))
FUEL_TANK_FULL.load()
FUEL_TANK_EMPTY.load()
const FUEL_SCORE = 5;
const DESTRUCTION_SCORE = 150;
const FUEL_FULL = 2000;

export class FuelTankActor extends BaseActor {
    private fuelLevel = FUEL_FULL;
    private scoreManager: ScoreManager;

    constructor(object: TiledObject, scoreManager: ScoreManager) {
        super(object, FUEL_TANK_FULL, CollisionType.Fixed);
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent));        
        this.scoreManager = scoreManager;
    }

    public getPos(): Vector { return this.pos }

    public decreaseFuel(decrease: number): number {
        if (this.fuelLevel <= 0) return 0
        if (this.fuelLevel < decrease) {
            decrease = this.fuelLevel
            this.fuelLevel = 0
        }
        this.fuelLevel -= decrease
        if (this.fuelLevel <= 0) {
            this.fuelLevel = 0
            this.graphics.use(FUEL_TANK_EMPTY.toSprite())
        }
        this.scoreManager.addScore(FUEL_SCORE);        
        return decrease
    }

    public addPos(pos: Vector) {
        this.pos = this.pos.add(pos)
    }

    private handleCollision(evt: CollisionStartEvent): void {
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() instanceof TurretActor) return;
        }
        SoundManager.playActorExplosion();        
        this.explode()
        this.scoreManager.addScore(DESTRUCTION_SCORE);        
    }    
}
