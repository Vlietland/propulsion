import { ImageSource, Sprite } from 'excalibur';

export class AssetLoader {
  private static readonly IMAGE_PATHS: Record<string, string> = {
    ship: '/images/tiles/ship.png',
    ball: '/images/tiles/ball.png',
    turret: '/images/tiles/reactor.png',
    reactor: '/images/tiles/reactor.png',
  };

  private spriteCache: Record<string, Sprite> = {};

  async loadSprites(): Promise<Record<string, Sprite>> {
    const promises = Object.entries(AssetLoader.IMAGE_PATHS).map(async ([key, path]) => {
      const image = new ImageSource(path);
      await image.load();
      this.spriteCache[key] = image.toSprite();
    });

    await Promise.all(promises);
    return this.spriteCache;
  }

  async loadMapData(mapPath: string): Promise<any> {
    const response = await fetch(mapPath);
    if (!response.ok) {
      throw new Error(`Failed to load map: ${mapPath}`);
    }
    return response.json();
  }

  getSprite(name: string): Sprite | undefined {
    return this.spriteCache[name];
  }
}
