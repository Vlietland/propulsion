import { TiledObject } from '@excalibur-tiled/index'
import { Actor, CollisionType, Vector, ImageSource } from 'excalibur';
import { BaseActor } from './baseActor';

export const REACTOR = new ImageSource('/images/tiles/reactor.png');
await REACTOR.load();

export class ReactorActor extends BaseActor {
    constructor(object: TiledObject) {
        super(object, REACTOR, CollisionType.Fixed);
    }
}
