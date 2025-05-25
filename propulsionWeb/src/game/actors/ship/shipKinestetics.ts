import { Vector } from 'excalibur'
import { Physics } from '@src/game/physics/physics'

export class ShipKinematics {
    private velocity: Vector = Vector.Zero
    private angularVelocity: number = 0
    private angle: number = 0

    constructor(
        private physics: Physics,
        private shipMass: number
    ) {}

    update(
        thrustForce: Vector,
        shipPos: Vector,
        ballPos: Vector | undefined,
        ballMass: number | undefined,
        cycleTime: number
    ): {
        shipDelta: Vector
        ballDelta?: Vector
        deltaAngle: number
    } {
        let totalMass = this.shipMass
        let acceleration: Vector

        if (ballPos && ballMass !== undefined) {
            totalMass += ballMass
            const gravityForceShip = new Vector(0, this.shipMass * this.physics.gravity)
            const gravityForceBall = new Vector(0, ballMass * this.physics.gravity)
            const netForce = thrustForce.add(gravityForceShip).add(gravityForceBall)
            acceleration = netForce.scale(1 / totalMass)
        } else {
            const gravityForce = new Vector(0, this.shipMass * this.physics.gravity)
            const netForce = thrustForce.add(gravityForce)
            acceleration = netForce.scale(1 / this.shipMass)
        }

        const { velocity, displacement } = this.physics.updateLinearMotion(
            acceleration,
            this.velocity,
            cycleTime
        )
        this.velocity = velocity

        if (!ballPos || ballMass === undefined) {
            return {
                shipDelta: displacement,
                deltaAngle: 0
            }
        }

        const angularAcceleration = this.physics.angularAcceleration(
            thrustForce,
            this.shipMass,
            ballMass,
            shipPos,
            ballPos
        )

        const rot = this.physics.updateRotationalMotion(
            angularAcceleration,
            this.angularVelocity,
            this.shipMass,
            ballMass,
            this.angle,
            cycleTime,
            shipPos.distance(ballPos)
        )

        this.angularVelocity = rot.angularVelocity
        this.angle = rot.angle

        return {
            shipDelta: displacement.add(rot.shipDelta),
            ballDelta: displacement.clone().add(rot.ballDelta),
            deltaAngle: rot.angle - this.angle + this.angularVelocity * cycleTime
        }
    }

    getVelocity(): Vector {
        return this.velocity
    }

    getAngle(): number {
        return this.angle
    }

    getAngularVelocity(): number {
        return this.angularVelocity
    }
}
