import * as ex from 'excalibur';

export const ENERGY_BALL_IMAGE = new ex.ImageSource('/images/energyBall.png');
const BALL_SCALE = 0.1;

export class EnergyBall extends ex.Actor {
    constructor() {
        super({
            width: 20,
            height: 20,
        });
        this.graphics.use(ENERGY_BALL_IMAGE.toSprite());
        this.scale = new ex.Vector(BALL_SCALE, BALL_SCALE);
        this.body.collisionType = ex.CollisionType.Active;

    }

    updatePosition(ship: ex.Actor) {
        const offset = ex.Vector.fromAngle(ship.rotation).scale(50); // Offset from the ship
        this.pos = ship.pos.add(offset);
    }
}