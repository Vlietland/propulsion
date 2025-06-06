import { Scene, Vector, CollisionType } from 'excalibur'
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource'
import { getLevelPath } from '@src/utils/assetPaths'

export class MapRenderer {
    public async loadAndRenderMap(scene: Scene, mapFile: string): Promise<any> {
        const map = new TiledResource(getLevelPath(mapFile), {
            layerConfig: { 'tiles': { isSolid: true }}
        })
        await map.load()
        map.addToScene(scene)
        return map
    }
}
