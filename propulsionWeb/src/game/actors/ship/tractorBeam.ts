import { Vector } from 'excalibur'
import { BallActor } from '@src/game/actors/ballActor'
import { FuelTankActor } from '@src/game/actors/fuelTankActor'
import { ShipActor } from '@src/game/actors/ship/shipActor'

const TRACTOR_WIDTH = 100
const TRACTOR_POWER = 25
const TRACTOR_REACH = 220

export class TractorBeam {
    private fuelTanks: FuelTankActor[] = []
    private ballActor?: BallActor
    private shipActor: ShipActor

    constructor(shipActor: ShipActor) { this.shipActor = shipActor }

    public addFuelTank(fuelTankActor: FuelTankActor): void { this.fuelTanks.push(fuelTankActor) }
    public setBall(ballActor: BallActor): void { this.ballActor = ballActor }

    public attractObjects(shipPos: Vector): void {
        if (this.ballActor)
        if (this.ballActor && !this.shipActor.isBallConnected() && this.isWithinRange(this.ballActor.pos, shipPos)) {
            this.attract(this.ballActor)
        }
        for (const fuelTank of this.fuelTanks) {
            if (this.isWithinRange(fuelTank.pos, shipPos)) {
                if (this.shipActor.getFuelLevel() + TRACTOR_POWER < this.shipActor.getMaxFuel()) {
                    const fuel = fuelTank.decreaseFuel(TRACTOR_POWER)
                    this.shipActor.increaseFuel(fuel)
                }
            }
        }
    }

    private isWithinRange(objectPos: Vector, shipPos: Vector): boolean {
        const isWithinWidth =
            objectPos.x >= shipPos.x - TRACTOR_WIDTH / 2 &&
            objectPos.x <= shipPos.x + TRACTOR_WIDTH / 2
        const isWithinLength =
            objectPos.y >= shipPos.y && objectPos.y <= shipPos.y + TRACTOR_REACH
        return isWithinWidth && isWithinLength
    }

    private attract(ballActor: BallActor) {
        if (this.shipActor.pos.distance(ballActor.pos) + 10 >= TRACTOR_REACH) {
            this.shipActor.attachBall(ballActor)
        }
    }

    getReach() { return TRACTOR_REACH }
}
