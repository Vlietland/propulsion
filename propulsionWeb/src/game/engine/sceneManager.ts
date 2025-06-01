import { Scene, Engine } from 'excalibur'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'
import { Hyperspace } from '@src/game/physics/hyperspace'
import { ShipActor } from '../actors/ship/shipActor'
import { LevelManager } from '@src/game/engine/levelManager'
import { ScoreManager } from '@src/game/engine/scoreManager'

const CAMERA_ZOOM = 0.8

export interface GameCallbacks {
    onShipLost: () => void
    onMissionFinished: () => void
}

export class SceneManager {
    private shipActor?: ShipActor
    private hud?: HUD
    private currentSceneName?: string

    constructor(
        private engine: Engine,
        private scoreManager: ScoreManager,
        private levelManager: LevelManager
    ) {}

    async registerScene(availableShips: number, callbacks: GameCallbacks): Promise<void> {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }

        this.currentSceneName = `level-${Date.now()}`

        const scene = new Scene()
        scene.camera.zoom = CAMERA_ZOOM
        this.hud = new HUD(this.scoreManager)
        this.hud.updateLives(availableShips)
        scene.add(this.hud)

        await this.levelManager.ensureInitialized()
        const map = await this.levelManager.getMap(scene)
        const hyperspace = new Hyperspace(map)
        const actorFactory = new ActorFactory(map, hyperspace, this.scoreManager)
        const gravity = map?.map?.properties?.find((p: any) => p.name === 'gravity')
        const enemyLevel = map?.map?.properties?.find((p: any) => p.name === 'enemyLevel')
        const physics = new Physics(gravity.value || 0)
        await actorFactory.createActors(scene, enemyLevel.value)
        
        const shipActor = actorFactory.getShipActor()
        if (shipActor) {
            this.shipActor = shipActor
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
            shipActor.setShipLostCallback(callbacks.onShipLost)
            shipActor.setMissionFinishedCallback(callbacks.onMissionFinished)            
        }
        this.engine.add(this.currentSceneName, scene)
        this.engine.goToScene(this.currentSceneName)
    }

    async showGameOverScene(): Promise<void> {
        const gameOverSceneName = `gameOver-${Date.now()}`
        const gameOverScene = new Scene()
        this.engine.add(gameOverSceneName, gameOverScene)
        this.engine.goToScene(gameOverSceneName)
    }

    getShipActor(): ShipActor | undefined {
        return this.shipActor
    }

    dispose(): void {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }
        this.shipActor = undefined
    }
}
