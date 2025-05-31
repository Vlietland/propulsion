import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { ScoreManager } from '@src/game/engine/scoreManager';

export const REACTOR = new ImageSource('/images/tiles/reactor.png');
await REACTOR.load();

export class ReactorActor extends BaseActor {
    private scoreManager: ScoreManager;

    constructor(object: TiledObject, scoreManager: ScoreManager) {
        super(object, REACTOR, CollisionType.Fixed);
        this.scoreManager = scoreManager;
    }
}
