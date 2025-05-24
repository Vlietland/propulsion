import { Vector } from 'excalibur'; // Assuming Vector is from excalibur based on other files

class Physics {
  private mass: number;
  private thrustForce: number;
  private towLength: number;
  private gravity: number;
  private cycleTime: number;
  private halfCycleTime: number;
  private XYVelocity: Vector;
  private positions: { ship: Vector; ball: Vector };

  constructor(options: {
    mass: number;
    totalAngles: number;
    towLenght: number;
    gravity: number;
    cycleTime: number;
    positions: { ship: Vector; ball: Vector };
  }) {
    this.mass = options.mass;
    this.thrustForce = options.thrustForce;
    this.towLength = options.towLength;
    this.gravity = options.gravity;
    this.cycleTime = options.cycleTime;
    this.halfCycleTime = options.cycleTime / 2;
    this.positions = options.positions;
    this.XYVelocity = new Vector(0, 0);
  }

  forcevector(shipRotation: number) {
    return Vector.fromAngle(shipRotation).scale(-this.thrustForce);
  }

  //a = F / m
  acceleration(forceVector: Vector): Vector {
    return new Vector(forceVector.x / this.mass, forceVector.y / this.mass);
  }

  calculateShipBallAcceleration(forceVector: Vector): Vector {
    return new Vector(forceVector.x / (2 * this.mass), forceVector.y / (2 * this.mass))
  }

  calculateShipBallRotationAcceleration(forceVector: Vector): number {
    const factor = {
      x: (this.positions.ship.x - this.positions.ball.x) / this.stangLength,
      y: (this.positions.ship.y - this.positions.ball.y) / this.stangLength,
    };

    const rotateForce = -forceVector.x * factor.y + forceVector.y * factor.x;
    return rotateForce / (2 * this.mass);
  }

  calculateShipBallMovement(acceleration: Vector): Vectors {
    this.XYVelocity.x += acceleration.x * this.halfCycleTime;
    this.XYVelocity.y += (acceleration.y + this.gravity) * this.halfCycleTime;

    return {
      ball: {
        x: this.XYVelocity.x * this.cycleTime,
        y: this.XYVelocity.y * this.cycleTime,
      }
    };
  }

  // Add other necessary methods and update positions if needed
  updatePositions(newPositions: { ship: Vector; ball: Vector }): void {
    this.positions = newPositions;
  }

  getVelocity(): Vector {
    return this.XYVelocity;
  }

  add(vectors XYmove,vectors rotatemove,vectors positions) : vectors
  {
   positions.ship.X += XYmove.ship.X + rotatemove.ship.X;
   positions.ship.Y += XYmove.ship.Y + rotatemove.ship.Y;
   positions.ball.X += XYmove.ball.X + rotatemove.ball.X;
   positions.ball.Y += XYmove.ball.Y + rotatemove.ball.Y;
   return(positions);
  }

intvecs Shipballdata::postocoor()
  {
   intvecs newcoors;

   newcoors.ship.Sx = positions.ship.X / bloklengte;
   newcoors.ship.Sy = positions.ship.Y / blokhoogte;
   newcoors.ball.Sx = positions.ball.X / bloklengte;
   newcoors.ball.Sy = positions.ball.Y / blokhoogte;

   return(newcoors);
  }
}

export default Physics;