import { Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
export const FUEL_TANK = new ImageSource('/images/tiles/fuelTank.png')
await FUEL_TANK.load()

export class FuelTankActor extends Actor {
    private FUEL_FULL = 1000
    private fuelLevel = this.FUEL_FULL

    constructor(pos: Vector, mass: number) {
        super({
            pos: pos,
            width: FUEL_TANK.width,
            height: FUEL_TANK.height,
            collisionType: CollisionType.Passive,
        })
        this.pos = pos
        this.graphics.use(FUEL_TANK.toSprite())
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
