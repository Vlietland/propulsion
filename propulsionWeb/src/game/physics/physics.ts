import { Vector } from 'excalibur'

const ARCADE_FACTOR = 50

export class Physics {
    private gravity: number

    constructor(gravity: number) {
        this.gravity = gravity
    }

    force(shipRotation: number, thrustForce: number) {
        return Vector.fromAngle(shipRotation).scale(thrustForce)
    }

    lineairAcceleration(
        thrustForce: Vector,
        shipMass: number,
        ballMass: number
    ): Vector {
        const gravityForceShip = new Vector(0, shipMass * this.gravity)
        const gravityForceBall = new Vector(0, ballMass * this.gravity)
        const netForce = thrustForce.add(gravityForceShip).add(gravityForceBall)
        const totalMass = shipMass + ballMass
        return netForce.scale(1 / totalMass)
    }

    //s = (v0 + 0.5at)t
    updateLinearMotion(
        acceleration: Vector,
        velocity: Vector,
        cycleTime: number
    ): { velocity: Vector; displacement: Vector } {
        const newVelocity = velocity.add(acceleration.scale(cycleTime))        
        const displacement = velocity.scale(cycleTime).add(acceleration.scale(0.5 * cycleTime * cycleTime))        
        return { velocity: newVelocity, displacement: displacement }
    }

    //Angular acceleration = (force × direction) ÷ ((m₁·m₂·r²)/(m₁+m₂))
    angularAcceleration(
        force: Vector,
        shipMass: number,
        ballMass: number,
        shipPos: Vector,
        ballPos: Vector
    ): number {
        const distance = shipPos.distance(ballPos)
        const direction = ballPos.sub(shipPos).normalize()
        const torqueValue = force.cross(direction)
        const momentOfInertia = (shipMass * ballMass * distance * distance / ARCADE_FACTOR) / (shipMass + ballMass)
        return momentOfInertia === 0 ? 0 : torqueValue / momentOfInertia        
    }

    updateAngularMotion(
        angularAcceleration: number,
        angularVelocity: number,
        shipMass: number,
        ballMass: number,
        angle: number,
        cycleTime: number,
        towLength: number
    ): {
        angle: number
        angularVelocity: number
        shipDelta: Vector
        ballDelta: Vector
    } {
        const totalMass = shipMass + ballMass // Calculate center of mass (weighted average of positions)
        const ballDistFromCM = (shipMass * towLength) / totalMass // Calculate distances from center of mass
        const shipDistFromCM = (ballMass * towLength) / totalMass

        const newAngularVelocity = angularVelocity + angularAcceleration * cycleTime // Update angular velocity (ω = ω₀ + α·t)
        const deltaAngle = newAngularVelocity * cycleTime // Update angle (θ = θ₀ + ω·t)
        const newAngle = angle + deltaAngle

        const shipPos = new Vector(
            shipDistFromCM * Math.cos(newAngle),
            shipDistFromCM * Math.sin(newAngle)
        )
        const ballPos = new Vector(
            -ballDistFromCM * Math.cos(newAngle),
            -ballDistFromCM * Math.sin(newAngle)
        )

        const shipDelta = shipPos.sub(new Vector(
            shipDistFromCM * Math.cos(angle),
            shipDistFromCM * Math.sin(angle)
        ))
        const ballDelta = ballPos.sub(new Vector(
            -ballDistFromCM * Math.cos(angle),
            -ballDistFromCM * Math.sin(angle)
        ))
        
        return {
            angle: newAngle,
            angularVelocity: newAngularVelocity,
            shipDelta,
            ballDelta
        }
    }
}
