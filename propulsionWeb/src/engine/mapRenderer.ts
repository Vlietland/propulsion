import { Scene, Vector} from 'excalibur';
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource';

const LEVEL_DATA_PATH = '/levels/';

export class MapRenderer {
  async loadAndRenderMap(scene: Scene, mapFile: string) {
    const map = new TiledResource(`${LEVEL_DATA_PATH}${mapFile}`);
    await map.load();
    
    map.addToScene(scene);
    scene.camera.pos = new Vector(1000,600)
  }
}
