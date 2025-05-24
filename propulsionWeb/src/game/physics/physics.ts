import { Vector } from 'excalibur'; 

export class Physics {
  private gravity: number;

  constructor( gravity: number) {
    this.gravity = gravity;
  }

  force(shipRotation: number, thrustForce: number) {
    return Vector.fromAngle(shipRotation).scale(thrustForce);
  }

  //a = F / m
  lineairAcceleration(force: Vector, mass: number): Vector {
    return new Vector(force.x / mass, force.y / mass);
  }
  //s = (v0 + 0.5at)t
  updateLinearMotion(acceleration: Vector, velocity: Vector, cycleTime: number): { velocity: Vector, displacement: Vector } {
    const newVelocity = velocity.clone();
    newVelocity.x += 0.5 * acceleration.x * cycleTime;
    newVelocity.y += 0.5 * (acceleration.y + this.gravity) * cycleTime;
    
    const displacement = new Vector(newVelocity.x * cycleTime, newVelocity.y * cycleTime);
    return { velocity: newVelocity, displacement: displacement};
  }
 
  //Angular acceleration = (force × direction) ÷ ((m₁·m₂·r²)/(m₁+m₂))
  angularAcceleration(force: Vector, shipMass: number, ballMass: number, shipPos: Vector, ballPos: Vector): number {
    const distance = shipPos.distance(ballPos);
    const direction = shipPos.sub(ballPos).normalize();
    const torqueValue = force.cross(direction);
    const momentOfInertia = (shipMass * ballMass * distance * distance) / (shipMass + ballMass);
    return momentOfInertia === 0 ? 0 : torqueValue / momentOfInertia;
  }

  updateRotationalMotion(angularAcceleration: number, angularVelocity: number,
    shipMass: number, ballMass: number, angle: number, cycleTime: number, towLength: number):
    { angle: number, angularVelocity: number, shipDelta: Vector, ballDelta: Vector} {

    const totalMass = shipMass + ballMass; // Calculate center of mass (weighted average of positions)      
    const ballDistFromCM = shipMass * towLength / totalMass; // Calculate distances from center of mass
    const shipDistFromCM = ballMass * towLength / totalMass;

    const newAngularVelocity = angularVelocity + 0.5 * angularAcceleration * cycleTime; // Update angular velocity (ω = ω₀ + α·t)
    const deltaAngle = newAngularVelocity * cycleTime; // Update angle (θ = θ₀ + ω·t)
    const newAngle = angle + deltaAngle;

    const shipDelta = new Vector( // Ship delta: circular arc traced by ship around CM 
      shipDistFromCM * (Math.sin(newAngle) - Math.sin(angle)),
      shipDistFromCM * (Math.cos(angle) - Math.cos(newAngle))
    );
    
    const ballDelta = new Vector( // Ball delta: circular arc traced by ball around CM
      ballDistFromCM * (Math.sin(angle) - Math.sin(newAngle)),
      ballDistFromCM * (Math.cos(newAngle) - Math.cos(angle))
    );
    return { angle: newAngle, angularVelocity: newAngularVelocity, shipDelta, ballDelta };
  }
}

export default Physics;