import * as ex from 'excalibur';
import { InputService } from '@src/game/input/inputService';
import { EnergyBall } from '@src/game/player/energyBall';

export const SHIP_IMAGE = new ex.ImageSource('/images/ship.png');

const SHIP_WIDTH = 50;
const SHIP_HEIGHT = 50;
const SHIP_SCALE = 0.1;
const ROTATION_SPEED = 2;
const ENGINE_THRUST = 200;
const GUN_POWER = 300;
const TRACTOR_BEAM_REACH = 150;

export class Ship extends ex.Actor {
    private energyBall: EnergyBall;

    constructor(x: number, y: number, private inputService: InputService) {
        super({
            x,
            y,
            width: SHIP_WIDTH,
            height: SHIP_HEIGHT,
        });
        this.graphics.use(SHIP_IMAGE.toSprite());
        this.scale = new ex.Vector(SHIP_SCALE, SHIP_SCALE);
        this.body.collisionType = ex.CollisionType.Active;
        this.energyBall = new EnergyBall();
    }

    onInitialize(engine: ex.Engine) {
        engine.add(this.energyBall);

        this.on('preupdate', () => {
            const rotationDirection = this.inputService.getRotationDirection();
            const isThrusting = this.inputService.isThrusting();
            const isShooting = this.inputService.isShooting();
            const isUsingTractorBeam = this.inputService.isUsingTractorBeam();

            this.rotation += rotationDirection * ROTATION_SPEED * engine.clock.elapsed() / 1000;

            if (isThrusting) {
                const thrustAngle = this.rotation - Math.PI / 2;
                const thrustVector = ex.Vector.fromAngle(thrustAngle).scale(ENGINE_THRUST);
                this.vel = this.vel.add(thrustVector.scale(engine.clock.elapsed() / 1000));
            }

            if (isShooting) {
                this.fireWeapon(engine);
            }

            if (isUsingTractorBeam) {
                this.useTractorBeam(engine);
            }

            this.energyBall.updatePosition(this);
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
}
