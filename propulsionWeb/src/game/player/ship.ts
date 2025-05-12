import * as ex from 'excalibur';
import { InputService } from '../core/services/inputService';

// Constants for ship behavior
const ROTATION_SPEED = 2; // Rotation speed in radians per second
const ENGINE_THRUST = 200; // Thrust power
const GUN_POWER = 300; // Speed of projectiles
const TRACTOR_BEAM_REACH = 150; // Distance for tractor beam

export class Ship extends ex.Actor {
    private inputService: InputService;

    constructor(x: number, y: number, inputService: InputService) {
        super({
            x,
            y,
            width: 50,
            height: 50,
            color: ex.Color.Green,
        });
        this.inputService = inputService;
    }

    onInitialize(engine: ex.Engine) {
        this.on('preupdate', (evt) => {
            const rotationDirection = this.inputService.getRotationDirection();
            const isThrusting = this.inputService.isThrusting();
            const isShooting = this.inputService.isShooting();
            const isUsingTractorBeam = this.inputService.isUsingTractorBeam();

            // Apply rotation
            this.rotation += rotationDirection * ROTATION_SPEED * evt.delta / 1000;

            // Apply thrust
            if (isThrusting) {
                const thrustVector = ex.Vector.fromAngle(this.rotation).scale(ENGINE_THRUST);
                this.vel = this.vel.add(thrustVector.scale(evt.delta / 1000));
            }

            // Fire weapon
            if (isShooting) {
                this.fireWeapon(engine);
            }

            // Use tractor beam
            if (isUsingTractorBeam) {
                this.useTractorBeam(engine);
            }
        });
    }

    private fireWeapon(engine: ex.Engine) {
        const projectile = new ex.Actor({
            x: this.pos.x,
            y: this.pos.y,
            width: 10,
            height: 10,
            color: ex.Color.Red,
        });

        // Set projectile velocity based on ship's rotation
        projectile.vel = ex.Vector.fromAngle(this.rotation).scale(GUN_POWER);

        // Add projectile to the game
        engine.add(projectile);
    }

    private useTractorBeam(engine: ex.Engine) {
        // Find nearby objects within tractor beam reach
        const nearbyActors = engine.currentScene.actors.filter((actor) => {
            return actor !== this && actor.pos.distance(this.pos) <= TRACTOR_BEAM_REACH;
        });

        // Apply tractor beam effect (e.g., pull objects closer)
        nearbyActors.forEach((actor) => {
            const pullVector = this.pos.sub(actor.pos).normalize().scale(50); // Pull strength
            actor.vel = actor.vel.add(pullVector);
        });
    }
}
