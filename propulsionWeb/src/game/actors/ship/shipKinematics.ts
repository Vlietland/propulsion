import { Vector } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { Physics } from '@src/game/physics/physics'

export class ShipKinematics {
    private objectVelocity = new Vector(0, 0)
    private physics: Physics

    constructor(physics: Physics) {
        this.physics = physics
    }

    updateShipKinematics(shipActor: ShipActor, forceVector: Vector, cycleTime: number) {
        const acceleration = this.physics.lineairAcceleration(forceVector, shipActor.getMass(), 0)
        const { velocity, displacement } = this.physics.updateLinearMotion(
            acceleration,
            this.objectVelocity,
            cycleTime
        )
        this.objectVelocity = velocity
        return displacement
    }
}