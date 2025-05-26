import { Actor, CollisionType, Vector, Scene, Engine } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { BallActor } from '@src/game/actors/ballActor'
import { TurretActor } from '@src/game/actors/turretActor'
import { ReactorActor } from '@src/game/actors/reactorActor'
import { LaserActor } from '@src/game/actors/laserActor'
import { FuelTankActor } from '@src/game/actors/fuelTankActor'

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
            const shipObject = layer.objects.find((object: any) => object.name === 'ship')
            if (shipObject) {
                const shipActor = await this.createActorFromObject(shipObject)
                if (shipActor instanceof ShipActor) {
                    this.shipActor = shipActor
                    scene.add(shipActor)
                }
            }
        }
    
        for (const layer of objectLayers) {
            for (const object of layer.objects) {
                if (object.name !== 'ship') {
                    const actor = await this.createActorFromObject(object)
                    if (actor) scene.add(actor)
                }
            }
        }
    }

    private async createActorFromObject(object: any): Promise<Actor | null> {
        let actor: Actor
        let mass = 0
        console.log(`Creating actor: ${object.name}`)
        switch (object.name) {
            case 'ship':
                mass = Number(object.properties.get('mass'))
                actor = new ShipActor(new Vector(object.x, object.y), mass);
                break;
            case 'ball':
                mass = Number(object.properties.get('mass'))                
                const ballActor = new BallActor(new Vector(object.x, object.y), mass);
                this.shipActor?.getTractorBeam()?.setBall(ballActor);
                actor = ballActor;
                break;
            case 'reactor':
                actor = new ReactorActor(new Vector(object.x, object.y));
                break;
            case 'fueltank':
                actor = new FuelTankActor(new Vector(object.x, object.y));
                break;
            case 'turret':
                actor = new TurretActor(new Vector(object.x, object.y));
                break;
            case 'laser':
                actor = new LaserActor(new Vector(object.x, object.y));
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

        return actor;
    }

    getShipActor(): ShipActor | null {
        return this.shipActor
    }
}
