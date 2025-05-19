import { Actor, Vector, CollisionType, Engine, ImageSource} from 'excalibur';
import { InputService } from '@src/game/ship/shipController';
export const SHIP_IMAGE = new ImageSource('/images/ship.png');

const ROTATION_SPEED = 2;
const ENGINE_THRUST = 200;
const GUN_POWER = 300;
const TRACTOR_BEAM_REACH = 150;
const TOW_LENGTH = 150;

export class ShipActor extends Actor {
  private inputService: InputService | null;
  private tractorBeamOn: boolean = false;
  private readonly mass = 1;

  constructor(options: {
    pos: Vector;
    width: number;
    height: number;
    collisionType: CollisionType;
  }) {
    super(options);
    this.inputService = null;
  }

  setInputService(inputService: InputService) {
    this.inputService = inputService;
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (this.inputService && this.inputService.isThrusting()) {
      const thrust = new Vector(
        Math.cos(this.rotation) * ENGINE_THRUST,
        Math.sin(this.rotation) * ENGINE_THRUST
      );
      this.vel = this.vel.add(thrust.scale(delta));
    }

    if (this.inputService) {
      const rotationDirection = this.inputService.getRotationDirection();
      this.rotation += rotationDirection * ROTATION_SPEED * delta;
      this.tractorBeamOn = this.inputService.isUsingTractorBeam();
    }
  }

  getMass(): number {
    return this.mass;
  }

  isTractorBeamActive(): boolean {
    return this.tractorBeamOn;
  }

  explode() {
    console.log('Ship exploded!');
    this.kill();
  }
}
