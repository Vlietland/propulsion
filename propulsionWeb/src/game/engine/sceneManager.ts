import { Scene, Engine, Keys, KeyEvent } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { HUD } from '@src/game/ui/hud'
import { LevelManager } from '@src/game/engine/levelManager'
import { ScoreManager } from '@src/scoreManager'
import { World } from '@src/game/engine/world'
import { GameResult } from '@src/menu/gameManager'
import { PauseScreen } from '@src/menu/ui/pauseScreen'

const START_ZOOM = 0.2
const CAMERA_ZOOM = 0.6

export interface GameCallbacks {
    onGameResult: (result: GameResult) => void
    onReturnToMenu?: () => void
}

export class SceneManager {
    private world?: World
    private hud?: HUD
    private currentSceneName?: string
    private isPaused: boolean = false
    private pauseKeyListener?: (evt: KeyEvent) => void
    private onReturnToMenu?: () => void

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
        this.onReturnToMenu = callbacks.onReturnToMenu
        this.currentSceneName = `level-${Date.now()}`
        const scene = new Scene()
        scene.camera.zoom = 0.1
        this.engine.add(this.currentSceneName, scene)
        this.engine.goToScene(this.currentSceneName)
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
        this.animateZoom(scene)
        this.setupPauseHandling()
    }

    private animateZoom(scene: Scene): void {
        const camera = scene.camera
        const startTime = Date.now()
        const duration = 2000
        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            camera.zoom = START_ZOOM + (CAMERA_ZOOM - 0.3) * progress
            if (progress < 1) requestAnimationFrame(animate)
        }
        animate()
    }

    private setupPauseHandling(): void {
        this.removePauseHandling()
        this.pauseKeyListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Escape) {
                if (!this.isPaused) {
                    this.pauseGame()
                } else {
                    this.resumeGame()
                }
            }
        }
        this.engine.input.keyboard.on('press', this.pauseKeyListener)
    }

    private removePauseHandling(): void {
        if (this.pauseKeyListener) {
            this.engine.input.keyboard.off('press', this.pauseKeyListener)
            this.pauseKeyListener = undefined
        }
    }

    private pauseGame(): void {
        if (this.isPaused) return
        this.isPaused = true
        // Stop the engine to pause all game logic while keeping input listeners active
        this.engine.stop()
        PauseScreen.show(
            () => this.resumeGame(),
            this.onReturnToMenu ? () => this.returnToMainMenu() : undefined,
            this.engine
        )
    }

    private resumeGame(): void {
        if (!this.isPaused) return
        this.isPaused = false
        PauseScreen.hideCurrentInstance()
        // Restart the engine to resume all game logic
        this.engine.start()
    }

    private returnToMainMenu(): void {
        PauseScreen.hideCurrentInstance()
        this.dispose()
        if (this.onReturnToMenu) this.onReturnToMenu()
    }

    public async showGameOverScene(): Promise<void> {
        const gameOverSceneName = `gameOver-${Date.now()}`
        const gameOverScene = new Scene()
        this.engine.add(gameOverSceneName, gameOverScene)
        this.engine.goToScene(gameOverSceneName)
    }

    public dispose(): void {
        this.removePauseHandling()
        PauseScreen.disposeCurrentInstance()
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
