import { Vector } from 'excalibur'
import { BallActor } from '@src/game/actors/ballActor'
import { FuelTankActor } from '@src/game/actors/fuelTankActor'
import { ShipActor } from '@src/game/actors/ship/shipActor'

const TRACTOR_WIDTH = 30
const TRACTOR_POWER = 20

export class TractorBeam {
    private fuelTanks: FuelTankActor[] = []
    private ballActor: BallActor | null = null
    private shipActor: ShipActor
    private tractorReach

    constructor(shipActor: ShipActor, tractorReach: number) {
        this.shipActor = shipActor
        this.tractorReach = tractorReach
    }

    addFuelTank(fuelTankActor: FuelTankActor): void {
        this.fuelTanks.push(fuelTankActor)
    }

    addBall(ballActor: BallActor): void {
        this.ballActor = ballActor
    }

    attractObjects(shipPos: Vector): void {
        if (this.ballActor && this.isWithinRange(this.ballActor, shipPos)) {
            this.attract(this.ballActor)
        }
        for (const fuelTank of this.fuelTanks) {
            if (this.isWithinRange(fuelTank, shipPos)) {
                const fuel = fuelTank.decreaseFuel(TRACTOR_POWER)
                this.shipActor.increaseFuel(fuel)
            }
        }
    }

    private isWithinRange(object: { pos: Vector }, shipPos: Vector): boolean {
        const isWithinWidth =
            object.pos.x >= shipPos.x - TRACTOR_WIDTH / 2 &&
            object.pos.x <= shipPos.x + TRACTOR_WIDTH / 2
        const isWithinLength =
            object.pos.y >= shipPos.y && object.pos.y <= shipPos.y + this.tractorReach
        return isWithinWidth && isWithinLength
    }

    private attract(ballActor: BallActor) {
        if (this.shipActor.pos.distance(ballActor.pos) >= this.tractorReach) {
            this.shipActor.setBall(ballActor)
        }
    }
}
