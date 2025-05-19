import { Actor, CollisionType, Vector, Sprite, Scene } from 'excalibur';
import { ShipActor } from '@src/game/actors/ship';
import { BallActor } from '@src/game/actors/ball';
import { TurretActor } from '@src/game/actors/turret';
import { ReactorActor } from '@src/game/actors/reactor';

export class ActorFactory {
  constructor(private map: any, private sprites: Record<string, Sprite>) {}

  createActors(scene: Scene): void {
    const objectLayers = this.map.getObjectLayers();
    for (const layer of objectLayers) {
      for (const object of layer.objects) {
        const actor = this.createActorFromObject(object);
        if (actor) {
          scene.add(actor);
        }
      }
    }
  }

  private createActorFromObject(object: any): Actor | null {
    const sprite = this.sprites[object.name];
    if (!sprite) return null;

    let actor: Actor;

    switch (object.name) {
      case 'ship':
        actor = new ShipActor({
          pos: new Vector(object.x, object.y),
          width: object.width,
          height: object.height,
          collisionType: CollisionType.Active,
        });
        break;

      case 'ball':
        actor = new BallActor({
          pos: new Vector(object.x, object.y),
          width: object.width,
          height: object.height,
          collisionType: CollisionType.Passive,
        });
        break;

      case 'turret':
        actor = new TurretActor({
          pos: new Vector(object.x, object.y),
          width: object.width,
          height: object.height,
          collisionType: CollisionType.Fixed,
        });
        break;

      case 'reactor':
        actor = new ReactorActor({
          pos: new Vector(object.x, object.y),
          width: object.width,
          height: object.height,
          collisionType: CollisionType.Fixed,
        });
        break;

      default:
        actor = new Actor({
          pos: new Vector(object.x, object.y),
          width: object.width,
          height: object.height,
          collisionType: CollisionType.Fixed,
        });
        break;
    }

    actor.graphics.use(sprite);
    return actor;
  }
}