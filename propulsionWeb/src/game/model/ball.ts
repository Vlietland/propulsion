
import { Ship } from './ship';

export const BALL_IMAGE = new ex.ImageSource('/images/energyBall.png');

export class Ball {
    public position: { x: number; y: number };
    private readonly mass = 1;    
    private ship: Ship;

    constructor(ship: Ship) {
        this.ship = ship;
        this.position = {
            x: ship.position.x + Math.cos(0) * TOW_LENGTH,
            y: ship.position.y + Math.sin(0) * TOW_LENGTH,
        };
    }

    update(delta: number) {

    }

    getMass(): number {
        return this.mass;
    }
}