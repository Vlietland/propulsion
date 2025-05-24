import { Camera, Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 3
const THRUST_FORCE = 5000
const SHIP_MASS = 50
const GUN_POWER = 300
const TOW_LENGTH = 150
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 5

export class ShipActor extends Actor {
  private physics?: Physics
  private camera?: Camera
  private shipController?: ShipController
  private objectAngularVelocity = 0
  private objectVelocity = new Vector(0,0)
  private ballConnected = false
  private tractorBeamOn = false
  private tractorBeam?: TractorBeam
  private fuelLevel = FUEL_FULL

  constructor(pos: Vector) {
    super({pos: pos, width: SHIP.width, height: SHIP.height, collisionType: CollisionType.Active})
    this.pos = pos
    this.rotation = -Math.PI / 2
    this.graphics.use(SHIP.toSprite())
  }
  
  onPreUpdate(engine: Engine, delta: number) {
    const cycleTime = delta / 1000;
    let accelerationVector = new Vector(0, 0);    
    
    if (this.physics) {
      if (!this.ballConnected) {
        if (this.shipController && this.shipController.isThrusting()) {
          const forceVector = this.physics.force(this.rotation, THRUST_FORCE)
          accelerationVector = this.physics.lineairAcceleration(forceVector, SHIP_MASS)
        }
        const {velocity, displacement} = this.physics.updateLinearMotion(accelerationVector, this.objectVelocity, cycleTime)
        this.objectVelocity = velocity
        this.pos = this.pos.add(displacement)      
      }
      else { //connected
        if (this.shipController && this.shipController.isThrusting()) {
          const forceVector = this.physics.force(this.rotation, THRUST_FORCE)
          const acceleration = this.physics.lineairAcceleration(forceVector, cycleTime)
        }
      }
    }

    if (this.shipController) {
      const rotationDirection = this.shipController.getRotationDirection()
      this.rotation += rotationDirection * ROTATION_SPEED * cycleTime
      this.tractorBeamOn = this.shipController.isUsingTractorBeam()
    }

    if (this.camera) this.camera.pos = this.pos
    if (this.shipController && this.shipController.isThrusting()) {
      this.graphics.use(SHIP_THRUST.toSprite())
      this.fuelLevel = this.fuelLevel - FUEL_CONSUMPTION      
    }
    else this.graphics.use(SHIP.toSprite())
  }

  setCamera(camera: Camera) {
    this.camera = camera
  }

  setPhysics(physics: Physics) {
    this.physics = physics;
  }

  setshipController(shipController: ShipController) {
    this.shipController = shipController
  }

  increaseFuel(fuel: number) {
    this.fuelLevel = this.fuelLevel + fuel
  }

  setBallConnected(connected: boolean) {
    this.ballConnected = connected
  }

  explode() {
    console.log('Ship exploded!')
    this.kill()
  }
}
