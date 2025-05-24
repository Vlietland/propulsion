import { Camera, Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 0.003
const THRUST_FORCE = 500
const GUN_POWER = 300
const TRACTOR_BEAM_REACH = 150
const TOW_LENGTH = 150
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 5

export class ShipActor extends Actor {
  private shipController: ShipController | null = null
  private tractorBeamOn = false
  private camera?: Camera
  private fuelLevel = FUEL_FULL
  private shipVelRotation = 0
  private ballConnected = false
  private physics: Physics
  private tractorBeam: TractorBeam

  constructor(pos: Vector) {
    super({pos: pos, width: SHIP.width, height: SHIP.height, collisionType: CollisionType.Active})
    this.pos = pos
    this.rotation = -Math.PI / 2
    this.graphics.use(SHIP.toSprite())

  }
  
  setshipController(shipController: ShipController) {
    this.shipController = shipController
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (this.ballConnected) {
      if (this.shipController && this.shipController.isThrusting()) {
        vector Vthrustforce = forcevectorcreate(this.rotation);
        XYmove     = shipballXYmove     (shipballXYversnelling     (Vthrustforce));
        rotatemove = shipballrotatemove (shipballrotateversnelling (Vthrustforce));
      }
      else {
        vector Vthrustforce = {0,0};
        XYmove     = shipballXYmove     (Vthrustforce);
        rotatemove = shipballrotatemove (0);
      }
    }
    else { //not connected
      if (this.shipController && this.shipController.isThrusting()) {
        XYmove = shipXYmove    (shipXYversnelling (forcevectorcreate(anglenr)));

        //const thrust = new Vector(Math.cos(this.rotation) * ENGINE_THRUST, Math.sin(this.rotation) * ENGINE_THRUST)
        //this.vel = this.vel.add(thrust.scale(delta))
      }
      else {
        vector Vthrustforce = {0,0};
        XYmove = shipXYmove (Vthrustforce);
      }
    }
    positions = add       (XYmove,rotatemove,positions);


    if (this.shipController) {
      const rotationDirection = this.shipController.getRotationDirection()
      this.rotation += rotationDirection * ROTATION_SPEED * delta
      this.tractorBeamOn = this.shipController.isUsingTractorBeam()
    }

    if (this.camera) this.camera.pos = this.pos
    if (this.shipController && this.shipController.isThrusting()) {
      this.graphics.use(SHIP_THRUST.toSprite())
      this.fuelLevel = this.fuelLevel - FUEL_CONSUMPTION      
    }
    else this.graphics.use(SHIP.toSprite())
    
    this.pos = this.pos.add(this.vel)
  }

  setCamera(camera: Camera) {
    this.camera = camera
  }

  increaseFuel(fuel: number) {
    this.fuelLevel = this.fuelLevel + fuel
  }

  isTractorBeamActive(): boolean {
    return this.tractorBeamOn
  }

  setBallConnected(connected: boolean) {
    this.ballConnected = connected
  }

  getPosition(): Vector {
    return this.pos
  }

  explode() {
    console.log('Ship exploded!')
    this.kill()
  }
}
