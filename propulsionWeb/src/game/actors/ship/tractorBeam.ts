import { Vector } from 'excalibur';
import { Ball } from '@src/game/actors/ballActor';
import { FuelTank } from '@src/game/actors/fuelTank';
import { ShipActor } from '@src/game/actors/ship/shipActor'

const TRACTOR_WIDTH = 30;
const TRACTOR_LENGTH = 150;
const TRACTOR_POWER = 20;

class TractorBeam {
    private fuelTanks: FuelTank[] = []
    private ball: Ball | null = null
    private shipActor: ShipActor

    constructor(shipActor: ShipActor) {
      this.shipActor = shipActor
    }

    addFuelTank(fuelTank: FuelTank): void {
        this.fuelTanks.push(fuelTank);
    }

    addBall(ball: Ball): void {
        this.ball = ball;
    }

    attractObjects(shipPos: Vector): void {
        if (this.ball && this.isWithinRange(this.ball, shipPos)) {
            this.attract(this.ball);
        }
        for (const fuelTank of this.fuelTanks) {
            if (this.isWithinRange(fuelTank, shipPos)) {
                fuelTank.decreaseFuel(TRACTOR_POWER)
                this.shipActor.increaseFuel(TRACTOR_POWER)
            }
        }
    }

    private isWithinRange(object: { pos: Vector }, shipPos: Vector): boolean {
      const isWithinWidth = 
          object.pos.x >= shipPos.x - TRACTOR_WIDTH/2 && 
          object.pos.x <= shipPos.x + TRACTOR_WIDTH/2;
      const isWithinLength = 
          object.pos.y >= shipPos.y && 
          object.pos.y <= shipPos.y + TRACTOR_LENGTH;
      return isWithinWidth && isWithinLength;
    }
}