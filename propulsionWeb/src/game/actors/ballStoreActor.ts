import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource } from 'excalibur';
import { BaseActor } from '@src/game/actors/baseActor';
import { getImagePath } from '@src/utils/assetPaths';

export const BALL_STORE = new ImageSource(getImagePath('tiles/ballStore.png'));
await BALL_STORE.load();

export class BallStoreActor extends BaseActor {
    constructor(object: TiledObject) {
        super(object, BALL_STORE, CollisionType.Fixed);
    }

    override generateCollisionPoints(image: ImageSource, count = 8) {
        // Create four corner points for a rectangular collision box
        this.collisionPoints = [
            new Vector(30, image.height),
            new Vector(30, image.height-10),
            new Vector(image.width-30, image.height-10),
            new Vector(image.width-30, image.height)
        ];
    }    
}
