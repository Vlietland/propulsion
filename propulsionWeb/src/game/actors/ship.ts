import { Camera, Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur';
import { ShipController } from '@src/game/controller/shipController';

const SHIP = new ImageSource('/images/tiles/ship.png');
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png');
await SHIP.load();
await SHIP_THRUST.load();

const ROTATION_SPEED = 0.003;
const ENGINE_THRUST = 0.03;
const GUN_POWER = 300;
const TRACTOR_BEAM_REACH = 150;
const TOW_LENGTH = 150;
const FUEL_FULL = 3300;
const FUEL_CONSUMPTION = 5

export class ShipActor extends Actor {
  private shipController: ShipController | null = null;
  private tractorBeamOn = false;
  private readonly mass = 1;
  private camera?: Camera
  private fuelLevel = FUEL_FULL

  constructor(pos: Vector) {
    super({pos: pos, width: SHIP.width, height: SHIP.height, collisionType: CollisionType.Active});
    this.pos = pos
    this.rotation = -Math.PI / 2
    this.graphics.use(SHIP.toSprite())
  }
  
  setshipController(shipController: ShipController) {
    this.shipController = shipController;
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (this.shipController && this.shipController.isThrusting()) {
      const thrust = new Vector(
        Math.cos(this.rotation) * ENGINE_THRUST,
        Math.sin(this.rotation) * ENGINE_THRUST
      )
      this.vel = this.vel.add(thrust.scale(delta))
      this.fuelLevel = this.fuelLevel - FUEL_CONSUMPTION;
      console.log(this.fuelLevel) 
      this.graphics.use(SHIP_THRUST.toSprite())
    }
    else this.graphics.use(SHIP.toSprite())

    this.pos = this.pos.add(this.vel)
    if (this.camera) this.camera.pos = this.pos;

    if (this.shipController) {
      const rotationDirection = this.shipController.getRotationDirection();
      this.rotation += rotationDirection * ROTATION_SPEED * delta;
      this.tractorBeamOn = this.shipController.isUsingTractorBeam();
    }
  }

  getMass(): number {
    return this.mass;
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  isTractorBeamActive(): boolean {
    return this.tractorBeamOn;
  }

  explode() {
    console.log('Ship exploded!');
    this.kill();
  }
}
