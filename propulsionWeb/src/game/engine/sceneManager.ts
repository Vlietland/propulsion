import { Scene, Engine, Sprite } from 'excalibur';
import { MapRenderer } from '@src/game/engine/mapRenderer';
import { ActorFactory } from '@src/game/actors/actorFactory';
import { AssetLoader } from '@src/game/engine/assetLoader';

export class SceneManager {
  private mapRenderer: MapRenderer;
  private assetLoader: AssetLoader;

  constructor(private engine: Engine) {
    this.mapRenderer = new MapRenderer();
    this.assetLoader = new AssetLoader();
  }

  async registerScenes() {
    const level1Scene = new Scene();

    const map = await this.mapRenderer.loadAndRenderMap(level1Scene, 'level1.json');
    const sprites: Record<string, Sprite> = await this.assetLoader.loadSprites();

    const actorFactory = new ActorFactory(map, sprites);
    actorFactory.createActors(level1Scene);

    this.engine.add('level1', level1Scene);
    this.engine.goToScene('level1');
  }
}
