import { TiledObject } from '@excalibur-tiled/index'
import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';

export const TURRET = new ImageSource('/images/tiles/turret.png');
await TURRET.load();

export class TurretActor extends BaseActor {
    constructor(object: TiledObject) {
        super(object, TURRET, CollisionType.Fixed);
    }
}
