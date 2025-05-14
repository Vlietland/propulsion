import * as ex from 'excalibur';
import planck from 'planck-js';
import { InputService } from '@src/game/input/inputService';
import { EnergyBall } from '@src/game/player/energyBall';

export const SHIP_IMAGE = new ex.ImageSource('/images/ship.png');

const SCALE = 50;
const ROTATION_SPEED = 2;
const ENGINE_THRUST = 200;
const GUN_POWER = 300; // Restored constant
const TRACTOR_BEAM_REACH = 150; // Restored constant

export class Ship extends ex.Actor {
    private body: planck.Body; // Planck.js body
    private inputService: InputService;
    private energyBall: EnergyBall;

    constructor(world: planck.World, x: number, y: number, inputService: InputService) {
        super({
            x: x * SCALE,
            y: y * SCALE,
            width: 50,
            height: 50,
        });

        this.inputService = inputService;

        // Create Planck.js body
        this.body = world.createBody({
            type: 'dynamic',
            position: planck.Vec2(x, y),
        });
        this.body.createFixture(planck.Box(1, 0.5), { density: 1 });

        // Set up Excalibur graphics
        this.graphics.use(SHIP_IMAGE.toSprite());
        this.scale = new ex.Vector(0.1, 0.1);

        this.energyBall = new EnergyBall(this);

        // Add collision listener
        world.on('begin-contact', (contact) => {
            const fixtureA = contact.getFixtureA();
            const fixtureB = contact.getFixtureB();

            if (fixtureA.getBody() === this.body || fixtureB.getBody() === this.body) {
                const otherFixture = fixtureA.getBody() === this.body ? fixtureB : fixtureA;

                // Check if the other body is a wall
                if (otherFixture.getUserData() === 'wall') {
                    this.explode();
                }
            }
        });
    }

    onInitialize(engine: ex.Engine) {
        engine.add(this.energyBall);

        this.on('preupdate', (evt) => {
            const delta = evt.delta; // Use delta for smooth updates
            const rotationDirection = this.inputService.getRotationDirection();
            const isThrusting = this.inputService.isThrusting();
            const isShooting = this.inputService.isShooting();
            const isUsingTractorBeam = this.inputService.isUsingTractorBeam();

            // Apply rotation
            this.rotation += rotationDirection * ROTATION_SPEED * delta / 1000;

            // Apply thrust
            if (isThrusting) {
                const thrustAngle = this.rotation - Math.PI / 2;
                const thrustVector = ex.Vector.fromAngle(thrustAngle).scale(ENGINE_THRUST * delta / 1000);
                this.vel = this.vel.add(thrustVector); // Update velocity directly
            }

            if (isShooting) {
                this.fireWeapon(engine);
            }

            if (isUsingTractorBeam) {
                this.useTractorBeam(engine);
            }
        });
    }

    onPreUpdate() {
        // Synchronize Excalibur actor with Planck.js body
        const pos = this.body.getPosition();
        this.pos.x = pos.x * SCALE;
        this.pos.y = pos.y * SCALE;
        this.rotation = this.body.getAngle();

        // Handle input
        const rotationDirection = this.inputService.getRotationDirection();
        const isThrusting = this.inputService.isThrusting();

        // Apply rotation
        if (rotationDirection !== 0) {
            this.body.applyAngularImpulse(rotationDirection * ROTATION_SPEED * 0.1);
        }

        // Apply thrust
        if (isThrusting) {
            const angle = this.body.getAngle();
            const force = planck.Vec2(Math.cos(angle) * ENGINE_THRUST, Math.sin(angle) * ENGINE_THRUST);
            this.body.applyForceToCenter(force);
        }
    }

    private fireWeapon(engine: ex.Engine) {
        const projectile = new ex.Actor({
            x: this.pos.x,
            y: this.pos.y,
            width: 10,
            height: 10,
            color: ex.Color.Red,
        });

        const firingAngle = this.rotation - Math.PI / 2;
        projectile.vel = ex.Vector.fromAngle(firingAngle).scale(GUN_POWER);

        engine.add(projectile);
    }

    private useTractorBeam(engine: ex.Engine) {
        const nearbyActors = engine.currentScene.actors.filter((actor) => {
            return actor !== this && actor.pos.distance(this.pos) <= TRACTOR_BEAM_REACH;
        });

        nearbyActors.forEach((actor) => {
            const pullVector = this.pos.sub(actor.pos).normalize().scale(50);
            actor.vel = actor.vel.add(pullVector);
        });
    }

    private explode() {
        console.log('Ship exploded!');
        this.kill(); // Remove the ship from the Excalibur scene
        this.body.getWorld().destroyBody(this.body); // Remove the Planck.js body
    }
}
