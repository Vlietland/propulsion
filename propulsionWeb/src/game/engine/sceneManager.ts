import { Scene, Engine, Keys, KeyEvent, Vector } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { HUD } from '@src/game/ui/hud'
import { LevelManager } from '@src/game/engine/levelManager'
import { ScoreManager } from '@src/scoreManager'
import { World } from '@src/game/engine/world'
import { GameResult } from '@src/menu/gameManager'
import { PauseScreen } from '@src/menu/ui/pauseScreen'
import { StarField } from '@src/game/ui/starField'
import { CountdownOverlay } from '@src/game/ui/countdownOverlay'

const START_ZOOM = 0.15
const CAMERA_ZOOM = 0.7

export interface GameCallbacks {
    onGameResult: (result: GameResult) => void
    onReturnToMenu?: () => void
}

export class SceneManager {
    private world?: World
    private hud?: HUD
    private starField?: StarField
    private countdownOverlay?: CountdownOverlay
    private currentSceneName?: string
    private isPaused: boolean = false
    private pauseKeyListener?: (evt: KeyEvent) => void
    private domKeyListener?: (evt: KeyboardEvent) => void
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
        const map = await this.levelManager.getMap(scene)
        const worldWidth = map.map.width * map.map.tilewidth
        const airTiles = map?.map?.properties?.find((p: any) => p.name === 'airHeight')?.value
        const worldHeight = airTiles * map.map.tileheight
        new StarField(scene, 80, new Vector(0, 0), new Vector(worldWidth, worldHeight))
        scene.camera.zoom = 0.1
        this.engine.add(this.currentSceneName, scene)
        this.engine.goToScene(this.currentSceneName)        
        
        this.hud = new HUD(this.scoreManager)
        this.hud.updateLives(availableShips)
        this.hud.updateLevel(this.levelManager.getCurrentLevel())
        scene.add(this.hud)
                
        this.world = new World(scene, this.scoreManager, this.levelManager)
        await this.world.initialize()
        this.countdownOverlay = new CountdownOverlay(this.world.getReactorActor())
        scene.add(this.countdownOverlay)

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
        this.domKeyListener = (evt: KeyboardEvent) => {
            if (evt.code === 'Escape') {
                evt.preventDefault()
                if (!this.isPaused) {
                    this.pauseGame()
                } else {
                    this.resumeGame()
                }
            }
        }
        document.addEventListener('keydown', this.domKeyListener)
    }

    private removePauseHandling(): void {
        if (this.pauseKeyListener) {
            this.engine.input.keyboard.off('press', this.pauseKeyListener)
            this.pauseKeyListener = undefined
        }
        if (this.domKeyListener) {
            document.removeEventListener('keydown', this.domKeyListener)
            this.domKeyListener = undefined
        }
    }

    private pauseGame(): void {
        if (this.isPaused) return
        this.isPaused = true
        
        // Pause the scene without stopping the engine
        const currentScene = this.engine.currentScene
        if (currentScene) {
            // Store references to all actors and their update methods
            currentScene.actors.forEach(actor => {
                // Temporarily disable actor updates by storing and replacing the update method
                if (actor.update && !(actor as any)._originalUpdate) {
                    (actor as any)._originalUpdate = actor.update
                    actor.update = () => {} // No-op function
                }
            })
        }
        
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
        
        // Resume the scene by restoring actor update methods
        const currentScene = this.engine.currentScene
        if (currentScene) {
            currentScene.actors.forEach(actor => {
                // Restore original update methods
                if ((actor as any)._originalUpdate) {
                    actor.update = (actor as any)._originalUpdate
                    delete (actor as any)._originalUpdate
                }
            })
        }
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
        if (this.starField) {
            this.starField.dispose()
            this.starField = undefined
        }
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }
        if (this.world) {
            this.world.dispose()
            this.world = undefined
        }
        if (this.countdownOverlay) {
            this.countdownOverlay.dispose()
            this.countdownOverlay = undefined
        }
    }
}
