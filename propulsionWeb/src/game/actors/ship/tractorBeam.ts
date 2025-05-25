import { Vector } from 'excalibur'
import { BallActor } from '@src/game/actors/ballActor'
import { FuelTankActor } from '@src/game/actors/fuelTankActor'
import { ShipActor } from '@src/game/actors/ship/shipActor'

const TRACTOR_WIDTH = 50
const TRACTOR_POWER = 20

export class TractorBeam {
    private fuelTanks: FuelTankActor[] = []
    private ballActor?: BallActor
    private shipActor: ShipActor
    private tractorReach

    constructor(shipActor: ShipActor, tractorReach: number) {
        this.shipActor = shipActor
        this.tractorReach = tractorReach
    }

    addFuelTank(fuelTankActor: FuelTankActor): void {
        this.fuelTanks.push(fuelTankActor)
    }

    setBall(ballActor: BallActor): void {
        this.ballActor = ballActor
    }

    attractObjects(shipPos: Vector): void {
        if (this.ballActor)
        if (this.ballActor && !this.shipActor.isBallConnected() && this.isWithinRange(this.ballActor.pos, shipPos)) {
            this.attract(this.ballActor)
        }
        for (const fuelTank of this.fuelTanks) {
            if (this.isWithinRange(fuelTank.pos, shipPos)) {
                const fuel = fuelTank.decreaseFuel(TRACTOR_POWER)
                this.shipActor.increaseFuel(fuel)
            }
        }
    }

    private isWithinRange(objectPos: Vector, shipPos: Vector): boolean {
        const isWithinWidth =
            objectPos.x >= shipPos.x - TRACTOR_WIDTH / 2 &&
            objectPos.x <= shipPos.x + TRACTOR_WIDTH / 2
        const isWithinLength =
            objectPos.y >= shipPos.y && objectPos.y <= shipPos.y + this.tractorReach
        return isWithinWidth && isWithinLength
    }

    private attract(ballActor: BallActor) {
        if (this.shipActor.pos.distance(ballActor.pos) + 10 >= this.tractorReach) {
            this.shipActor.setBall(ballActor)
        }
    }
}
