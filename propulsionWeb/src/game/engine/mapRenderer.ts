import { Scene, Vector} from 'excalibur';
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource';

const LEVEL_DATA_PATH = '/levels/';

export class MapRenderer {
  async loadAndRenderMap(scene: Scene, mapFile: string): Promise<any> {
    const map = new TiledResource(`${LEVEL_DATA_PATH}${mapFile}`);
    await map.load();
    
    map.addToScene(scene);
    return map;
  }
}
