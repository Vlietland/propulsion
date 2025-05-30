import { Scene, Vector, CollisionType } from 'excalibur'
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource'

const LEVEL_DATA_PATH = '/levels/'

export class MapRenderer {
    async loadAndRenderMap(scene: Scene, mapFile: string): Promise<any> {
        const map = new TiledResource(`${LEVEL_DATA_PATH}${mapFile}`, {
            layerConfig: { 'tiles': { isSolid: true }}
        })
        await map.load()
        // Patch: Only nonzero GID tiles are solid
        const tileLayers = map.getTileLayers ? map.getTileLayers() : []
        for (const layer of tileLayers) {
            if (layer.tilemap && layer.data) {
                for (let i = 0; i < layer.data.length; i++) {
                    const gid = layer.data[i]
                    if (gid === 0 && layer.tilemap.tiles[i]) {
                        layer.tilemap.tiles[i].solid = false
                    }
                }
            }
        }
        map.addToScene(scene)
        return map
    }
}
