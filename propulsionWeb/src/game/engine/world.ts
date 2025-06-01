import { Scene, Actor } from 'excalibur'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipActor } from '@src/game/actors/ship/shipActor'
import { Physics } from '@src/game/physics/physics'
import { Hyperspace } from '@src/game/physics/hyperspace'
import { ScoreManager } from '@src/game/engine/scoreManager'
import { LevelManager } from '@src/game/engine/levelManager'

export class World {
    private actorFactory?: ActorFactory
    private shipActor?: ShipActor
    private physics?: Physics
    private actors: Actor[] = []

    constructor(
        private scene: Scene,
        private scoreManager: ScoreManager,
        private levelManager: LevelManager
    ) {}

    async initialize(): Promise<void> {
        await this.levelManager.ensureInitialized()
        const map = await this.levelManager.getMap(this.scene)
        const hyperspace = new Hyperspace(map)
        
        this.actorFactory = new ActorFactory(this, map, hyperspace, this.scoreManager)
        
        const gravity = map?.map?.properties?.find((p: any) => p.name === 'gravity')
        this.physics = new Physics(gravity?.value || 0)
        
        const enemyLevel = map?.map?.properties?.find((p: any) => p.name === 'enemyLevel')?.value || 1
        await this.actorFactory.createActors(this.scene, enemyLevel)
        this.shipActor = this.actorFactory.getShipActor() || undefined
    }

    registerActor(actor: Actor): void {
        this.actors.push(actor)
    }

    explodeAllActors(): void {
        for (const actor of this.actors) {
            if (actor && !actor.isKilled() && typeof (actor as any).explode === 'function') {
                (actor as any).explode()
            }
        }
    }

    getShipActor(): ShipActor | undefined { return this.shipActor }
    getPhysics(): Physics | undefined { return this.physics }

    dispose(): void {
        this.actorFactory = undefined
        this.shipActor = undefined
        this.physics = undefined
        this.actors = []
    }
}
