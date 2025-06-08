import { Scene, Vector, CollisionType } from 'excalibur'
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource'
import { FileLoader } from '@excalibur-tiled/resource/file-loader'
import { getLevelPath } from '@src/utils/assetPaths'

const customFileLoader: FileLoader = async (path: string, contentType: 'json' | 'xml') => {
    const basePath = __ASSET_BASE_PATH__ || ''
    const fullPath = path.startsWith(basePath) ? path : basePath + path
    const response = await fetch(fullPath)
    switch(contentType.toLowerCase()) {
        case 'xml': return await response.text()
        case 'json': return await response.json()
        default: return await response.text()
    }
}

const createPathMap = () => {
    const basePath = __ASSET_BASE_PATH__ || ''
    if (!basePath) return undefined
    
    return [
        { path: /^tiles\/.+$/, output: `${basePath}/images/[match]` },
        { path: /^(?!https?:\/\/)(.+\.(png|jpg|jpeg|gif|webp))$/i, output: `${basePath}/images/[match]` }
    ]
}

export class MapRenderer {
    public async loadAndRenderMap(scene: Scene, mapFile: string): Promise<any> {
        const map = new TiledResource(getLevelPath(mapFile), {
            layerConfig: { 'tiles': { isSolid: true }},
            fileLoader: customFileLoader,
            pathMap: createPathMap()
        })
        await map.load()
        map.addToScene(scene)
        return map
    }
}
