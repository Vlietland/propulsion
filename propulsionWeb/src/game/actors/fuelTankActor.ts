import { TiledObject } from '@excalibur-tiled/index'
import { Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor';

export const FUEL_TANK = new ImageSource('/images/tiles/fuelTank.png')
await FUEL_TANK.load()

export class FuelTankActor extends BaseActor {
    private FUEL_FULL = 1000;
    private fuelLevel = this.FUEL_FULL;

    constructor(object: TiledObject) {
        super(object, FUEL_TANK, CollisionType.Passive);
    }

    getPos(): Vector {
        return this.pos
    }

    decreaseFuel(decrease: number): number {
        if (this.fuelLevel <= 0) return 0
        if (this.fuelLevel < decrease) {
            const remainingFuel = this.fuelLevel
            this.fuelLevel = 0
            return remainingFuel
        }
        this.fuelLevel -= decrease
        return decrease
    }

    addPos(pos: Vector) {
        this.pos = this.pos.add(pos)
    }
}
