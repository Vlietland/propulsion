import { Scene } from 'excalibur'
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

    constructor(
        private scene: Scene,
        private scoreManager: ScoreManager,
        private levelManager: LevelManager
    ) {}

    async initialize(enemyLevel: number): Promise<void> {
        await this.levelManager.ensureInitialized()
        const map = await this.levelManager.getMap(this.scene)
        const hyperspace = new Hyperspace(map)
        
        this.actorFactory = new ActorFactory(map, hyperspace, this.scoreManager)
        
        const gravity = map?.map?.properties?.find((p: any) => p.name === 'gravity')
        this.physics = new Physics(gravity?.value || 0)
        
        await this.actorFactory.createActors(this.scene, enemyLevel)
        this.shipActor = this.actorFactory.getShipActor() || undefined
    }

    getShipActor(): ShipActor | undefined {
        return this.shipActor
    }

    getPhysics(): Physics | undefined {
        return this.physics
    }

    dispose(): void {
        this.actorFactory = undefined
        this.shipActor = undefined
        this.physics = undefined
    }
}
