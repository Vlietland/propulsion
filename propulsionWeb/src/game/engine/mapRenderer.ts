import { Scene, Vector, CollisionType } from 'excalibur'
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource'

const LEVEL_DATA_PATH = '/levels/'

export class MapRenderer {
    public async loadAndRenderMap(scene: Scene, mapFile: string): Promise<any> {
        const map = new TiledResource(`${LEVEL_DATA_PATH}${mapFile}`, {
            layerConfig: { 'tiles': { isSolid: true }}
        })
        await map.load()
        map.addToScene(scene)
        return map
    }
}
