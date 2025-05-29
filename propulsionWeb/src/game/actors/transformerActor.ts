import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';

export const TRANSFORMER = new ImageSource('/images/tiles/transformer.png');
await TRANSFORMER.load();

export class TransformerActor extends BaseActor {
    constructor(object: TiledObject) {
        super(object, TRANSFORMER, CollisionType.Fixed);
    }
}