import { Actor, CollisionType, Vector, Scene, Engine } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { BallActor } from '@src/game/actors/ballActor'
import { TurretActor } from '@src/game/actors/turretActor'
import { ReactorActor } from '@src/game/actors/reactorActor'
import { LaserActor } from '@src/game/actors/laserActor'
import { FuelTankActor } from '@src/game/actors/fuelTankActor'
import { TransformerActor } from '@src/game/actors/transformerActor'
import { BallStoreActor } from '@src/game/actors/ballStoreActor'
import { Hyperspace } from '@src/game/physics/hyperspace'
import { ScoreManager } from '@src/game/engine/scoreManager'
import { World } from '@src/game/engine/world'

export class ActorFactory {
    private shipActor: ShipActor | null = null
    private hyperspace?: Hyperspace
    private scoreManager: ScoreManager
    private transformers: TransformerActor[] = []
    private lasers: LaserActor[] = []
    private map: any
    private world: World

    constructor(world: World, map: any, hyperspace: Hyperspace, scoreManager: ScoreManager) {
        if (!map || !map.layers) {
            throw new Error('Invalid map data: "layers" property is missing or undefined.')
        }
        this.world = world
        this.map = map
        this.hyperspace = hyperspace
        this.scoreManager = scoreManager
    }

    async createActors(scene: Scene, enemyLevel: number): Promise<void> {
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
                const shipActor = await this.createActorFromObject(shipObject, enemyLevel)
                if (shipActor instanceof ShipActor) {
                    this.shipActor = shipActor
                    scene.add(shipActor)
                }
            }
        }
    
        for (const layer of objectLayers) {
            for (const object of layer.objects) {
                if (object.name !== 'ship') {
                    const actor = await this.createActorFromObject(object, enemyLevel)
                    if (actor) scene.add(actor)
                }
            }
        }

        for (const transformer of this.transformers) {
            const transformerGroup = transformer.getGroupID()
            if (transformerGroup === undefined) continue
            for (const laser of this.lasers) {
                if (laser.getGroupID() === transformerGroup) {
                    transformer.setLaser(laser)
                    break
                }
            }
        }
    }

    private async createActorFromObject(object: any, enemyLevel: number): Promise<Actor | null> {
        if (this.hyperspace === undefined) return null
        let actor: Actor | null = null
        switch (object.name) {
            case 'ship':
                actor = new ShipActor(object);
                break;
            case 'ball':
                const ballActor = new BallActor(object);
                this.shipActor?.getTractorBeam()?.setBall(ballActor);
                this.shipActor?.setHyperspace(this.hyperspace);
                actor = ballActor;
                break;
            case 'reactor':
                actor = new ReactorActor(object, this.scoreManager);
                break;
            case 'fueltank':
                actor = new FuelTankActor(object, this.scoreManager);
                this.shipActor?.getTractorBeam()?.addFuelTank(actor as FuelTankActor);
                break;
            case 'turret':
                actor = new TurretActor(object, enemyLevel, this.scoreManager);
                break;
            case 'laser':
                actor = new LaserActor(object);
                this.lasers.push(actor as LaserActor);
                break;
            case 'transformer':
                actor = new TransformerActor(object);
                this.transformers.push(actor as TransformerActor);
                break;
            case 'ballStore':
                actor = new BallStoreActor(object);
                break;
            default:
                return null;
        }

        return actor;
    }

    getShipActor(): ShipActor | null {
        return this.shipActor
    }
}
