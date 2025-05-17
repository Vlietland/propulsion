import { InputService } from '@src/game/controller/keyboard';
export const SHIP_IMAGE = new ex.ImageSource('/images/ship.png');

const ROTATION_SPEED = 2;
const ENGINE_THRUST = 200;
const GUN_POWER = 300;
const TRACTOR_BEAM_REACH = 150;
const TOW_LENGTH = 150;

export class Ship {
    public position: { x: number; y: number };
    public rotation: number;
    public velocity: { x: number; y: number };
    private inputService: InputService;
    private tractorBeamOn: boolean;
    private readonly mass = 1;

    constructor(x: number, y: number, inputService: InputService) {
        this.position = { x, y };
        this.rotation = 0;
        this.velocity = { x: 0, y: 0 };
        this.inputService = inputService;
        this.tractorBeamOn = false;
    }

    update(delta: number) {
        if (this.inputService.isThrusting()) {
            const angle = this.rotation;
            const thrustX = Math.cos(angle) * ENGINE_THRUST;
            const thrustY = Math.sin(angle) * ENGINE_THRUST;
            this.velocity.x += thrustX * delta;
            this.velocity.y += thrustY * delta;
        }

        const rotationDirection = this.inputService.getRotationDirection();
        this.rotation += rotationDirection * ROTATION_SPEED * delta;

        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;

        this.tractorBeamOn = this.inputService.isUsingTractorBeam();
    }

    getMass(): number {
        return this.mass;
    }

    isTractorBeamActive(): boolean {
        return this.tractorBeamOn;
    }

    private explode() {
        console.log('Ship exploded!');
    }
}
