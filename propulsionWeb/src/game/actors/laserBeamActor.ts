import { TiledObject } from '@excalibur-tiled/index'
import { CollisionType, Vector, ImageSource, Engine, Actor } from 'excalibur'
import { BaseActor } from '@src/game/actors/baseActor'
import { getImagePath } from '@src/utils/assetPaths';

export const LASER_BEAM = new ImageSource(getImagePath('tiles/laserbeam.png'))
LASER_BEAM.load()

export class LaserBeamActor extends BaseActor {
    constructor(object: TiledObject) {
        super(object, LASER_BEAM, CollisionType.Fixed)
        this.graphics.use(LASER_BEAM.toSprite())
        this.z = -1
    }
}
