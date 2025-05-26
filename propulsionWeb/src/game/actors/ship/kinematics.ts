import { Vector } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { Physics } from '@src/game/physics/physics'

export class Kinematics {
    private physics: Physics
    private shipActor: ShipActor
    private objectAngle: number = 0
    private objectAngularVelocity = 0
    private objectVelocity = new Vector(0, 0)
    private towLength: number = 0

    constructor(shipActor: ShipActor, physics: Physics) {
        this.physics = physics
        this.shipActor = shipActor
    }

    updateShipKinematics( forceVector: Vector, cycleTime: number) : Vector{
        const acceleration = this.physics.lineairAcceleration(forceVector, this.shipActor.getMass(), 0)
        const { velocity, displacement } = this.physics.updateLinearMotion(
            acceleration,
            this.objectVelocity,
            cycleTime
        )
        this.objectVelocity = velocity
        return displacement
    }

    updateObjectKinematics(shipPos: Vector, forceVector: Vector, cycleTime: number) :
        { displacement: Vector, shipDelta: Vector, ballDelta: Vector } {
        const ball = this.shipActor.getBall()
        if (!ball) return {displacement: Vector.Zero, shipDelta: Vector.Zero, ballDelta: Vector.Zero }

        const acceleration = this.physics.lineairAcceleration(forceVector, this.shipActor.getMass(), ball.getMass())
        const { velocity, displacement } = this.physics.updateLinearMotion(
            acceleration,
            this.objectVelocity,
            cycleTime
        )
        this.objectVelocity = velocity

        const angularAcceleration = this.physics.angularAcceleration(
            forceVector,
            this.shipActor.getMass(),
            ball.getMass(),
            shipPos,
            ball.getPos()
        )
        const { angle, angularVelocity, shipDelta, ballDelta } =
            this.physics.updateAngularMotion(
                angularAcceleration,
                this.objectAngularVelocity,
                this.shipActor.getMass(),
                ball.getMass(),
                this.objectAngle,
                cycleTime,
                this.towLength
            )
        this.objectAngle = angle
        this.objectAngularVelocity = angularVelocity
        return { displacement, shipDelta, ballDelta }
    }

    setObjectAngle(objectAngle: number) { this.objectAngle = objectAngle }
    setTowLength(towLength: number) { this.towLength = towLength }
    resetObjectVelocity() { this.objectVelocity = Vector.Zero }
}
