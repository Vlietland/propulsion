import { Scene, Engine, Actor } from 'excalibur'

export class SceneManager {
  constructor(private engine: Engine) {}

  async registerScenes() {
    const level1Data = await this.loadLevelData('propulsionWeb/public/levels/level1.json');
    console.log('Loaded level1Data:', level1Data); // Log the map data for debugging
    const level1Scene = new Scene();

    if (level1Data.layers) {
      level1Data.layers.forEach((layer: any) => {
        if (layer.type === 'objectgroup') {
          layer.objects.forEach((objectData: any) => {
            const actor = new Actor({
              x: objectData.x,
              y: objectData.y,
              width: objectData.width,
              height: objectData.height,
            });
            level1Scene.add(actor);
          });
        }
      });
    }

    this.engine.add('level1', level1Scene);
    this.engine.goToScene('level1');
  }

  private async loadLevelData(fileName: string): Promise<any> {
    const response = await fetch(`/assets/${fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName}`);
    }
    return response.json();
  }
}
