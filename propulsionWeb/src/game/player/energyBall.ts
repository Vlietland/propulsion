// propulsionWeb/src/game/player/energyBall.ts
import * as ex from 'excalibur';

export const ENERGY_BALL_IMAGE = new ex.ImageSource('/images/energyBall.png');
const BALL_SCALE = 0.1;
const PENDULUM_LENGTH = 150;

export class EnergyBall extends ex.Actor {
    private ship: ex.Actor;
    private angle: number;
    private angularVel: number;

    constructor(ship: ex.Actor) {
        super({width: 20, height: 20});
        this.graphics.use(ENERGY_BALL_IMAGE.toSprite());
        this.scale = new ex.Vector(BALL_SCALE, BALL_SCALE);
        this.body.collisionType = ex.CollisionType.Active;
        this.body.useGravity = true;

        this.ship = ship;
        this.angle = Math.PI / 2;
        this.angularVel = 0;

        this.pos = this.ship.pos.add(new ex.Vector(Math.cos(this.angle), Math.sin(this.angle)).scale(PENDULUM_LENGTH));
    }

    update(engine: ex.Engine, delta: number) {
        this.pos = this.ship.pos.add(new ex.Vector(Math.cos(this.angle), Math.sin(this.angle)).scale(PENDULUM_LENGTH));
        this.vel = this.ship.vel;

        const gravity = 1000;
        const angleAcc = -gravity / PENDULUM_LENGTH * Math.sin(this.angle);
        this.angularVel += angleAcc * delta / 1000;
        this.angle += this.angularVel * delta / 1000;
    }
}
