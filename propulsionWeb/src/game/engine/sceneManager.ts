import { Scene, Engine } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { HUD } from '@src/game/ui/hud'
import { LevelManager } from '@src/game/engine/levelManager'
import { ScoreManager } from '@src/game/engine/scoreManager'
import { World } from '@src/game/engine/world'
import { GameResult } from '@src/game/engine/gameManager'

const CAMERA_ZOOM = 0.8

export interface GameCallbacks {
    onGameResult: (result: GameResult) => void
}

export class SceneManager {
    private world?: World
    private hud?: HUD
    private currentSceneName?: string

    constructor(
        private engine: Engine,
        private scoreManager: ScoreManager,
        private levelManager: LevelManager
    ) {}

    public async registerScene(availableShips: number, callbacks: GameCallbacks): Promise<void> {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }

        this.currentSceneName = `level-${Date.now()}`

        const scene = new Scene()
        scene.camera.zoom = CAMERA_ZOOM
        this.hud = new HUD(this.scoreManager)
        this.hud.updateLives(availableShips)
        this.hud.updateLevel(this.levelManager.getCurrentLevel())
        scene.add(this.hud)

        this.world = new World(scene, this.scoreManager, this.levelManager)
        await this.world.initialize()
        
        const shipActor = this.world.getShipActor()
        const physics = this.world.getPhysics()
        
        if (shipActor && physics) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
            shipActor.setOnGameResult((result: GameResult) => callbacks.onGameResult(result))
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

    dispose(): void {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }
        if (this.world) {
            this.world.dispose()
            this.world = undefined
        }
    }
}
