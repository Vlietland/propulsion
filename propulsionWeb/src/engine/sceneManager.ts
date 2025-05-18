import { Scene, Engine, Actor } from 'excalibur'
import { MapRenderer } from '@src/engine/mapRenderer';

export class SceneManager {
  private mapRenderer: MapRenderer;

  constructor(private engine: Engine) {
    this.mapRenderer = new MapRenderer();
  }

  async registerScenes() {
    const level1Scene = new Scene();
    await this.mapRenderer.loadAndRenderMap(level1Scene, 'level1.json');
    this.engine.add('level1', level1Scene);
    this.engine.goToScene('level1');
  }
}
