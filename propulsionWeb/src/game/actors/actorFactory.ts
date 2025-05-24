import { Actor, CollisionType, Vector, Scene, Engine } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { BallActor } from '@src/game/actors/ballActor'
import { TurretActor } from '@src/game/actors/turretActor'
import { ReactorActor } from '@src/game/actors/reactorActor'

export class ActorFactory {
    private shipActor: ShipActor | null = null
    constructor(private map: any) {}

    async createActors(scene: Scene): Promise<void> {
        if (!this.map || !this.map.layers) {
            throw new Error('Invalid map data: "layers" property is missing or undefined.')
        }

        const objectLayers = this.map.layers.filter(
            (layer: any) =>
                (layer.type === 'objectgroup' || layer.type === undefined) &&
                layer.name?.toLowerCase() === 'objects'
        )

        for (const layer of objectLayers) {
            for (const object of layer.objects) {
                const actor = await this.createActorFromObject(object)
                if (actor) scene.add(actor)
                if (actor instanceof ShipActor) this.shipActor = actor
            }
        }
    }

    private async createActorFromObject(object: any): Promise<Actor | null> {
        let actor: Actor
        switch (object.name) {
            case 'ship':
                actor = new ShipActor(new Vector(object.x, object.y))
                break
            case 'ball':
                actor = new BallActor(new Vector(object.x, object.y), 100)
                break

            case 'turret':
                actor = new TurretActor({
                    pos: new Vector(object.x, object.y),
                    width: object.width,
                    height: object.height,
                    collisionType: CollisionType.Fixed,
                })
                break

            case 'reactor':
                actor = new ReactorActor({
                    pos: new Vector(object.x, object.y),
                    width: object.width,
                    height: object.height,
                    collisionType: CollisionType.Fixed,
                })
                break

            default:
                actor = new Actor({
                    pos: new Vector(object.x, object.y),
                    width: object.width,
                    height: object.height,
                    collisionType: CollisionType.Fixed,
                })
                break
        }

        return actor
    }

    getShipActor(): ShipActor | null {
        return this.shipActor
    }
}
