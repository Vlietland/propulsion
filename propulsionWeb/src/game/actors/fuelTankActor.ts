import { TiledObject } from '@excalibur-tiled/index'
import { Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';
import { ScoreManager } from '@src/game/engine/scoreManager';

export const FUEL_TANK_FULL = new ImageSource('/images/tiles/fuelTankFull.png')
export const FUEL_TANK_EMPTY = new ImageSource('/images/tiles/fuelTankEmpty.png')
await FUEL_TANK_FULL.load()
await FUEL_TANK_EMPTY.load()
const FUEL_SCORE = 5;

export class FuelTankActor extends BaseActor {
    private FUEL_FULL = 1000;
    private fuelLevel = this.FUEL_FULL;
    private scoreManager: ScoreManager;

    constructor(object: TiledObject, scoreManager: ScoreManager) {
        super(object, FUEL_TANK_FULL, CollisionType.Fixed);
        this.scoreManager = scoreManager;
    }

    getPos(): Vector { return this.pos }

    decreaseFuel(decrease: number): number {
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

    addPos(pos: Vector) {
        this.pos = this.pos.add(pos)
    }
}
