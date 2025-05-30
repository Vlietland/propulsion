import { Scene, Engine, TileMap, Actor } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'

const CAMERA_ZOOM = 0.8
const MAIN_SCENE_NAME = 'level1'
const GAME_OVER_SCENE_NAME = 'gameOver'
const TRANSITION_DELAY = 50
const EXPLOSION_DELAY = 2500

export class SceneManager {
    private mapRenderer: MapRenderer
    private hud?: HUD
    private availableShips: number = 3
    private loadingScenes: string[] = []

    constructor(private engine: Engine) {
        this.mapRenderer = new MapRenderer()
    }

    private cleanupScenes() {
        try {
            this.engine.remove(MAIN_SCENE_NAME)
            this.engine.remove(GAME_OVER_SCENE_NAME)
            this.loadingScenes.forEach(name => {
                this.engine.remove(name)
            })
            this.loadingScenes = []
        } catch (e) {
            console.error('Scene cleanup error:', e)
        }
    }

    handleShipLoss() {
        this.availableShips -= 1
        if (this.hud) this.hud.updateLives(this.availableShips)
        
        setTimeout(() => {
            if (this.availableShips > 0) this.resetScene()
            else this.showGameOverScreen()
        }, EXPLOSION_DELAY)
    }

    private async resetScene() {
        const loadingSceneName = `loading-${Date.now()}`
        this.loadingScenes.push(loadingSceneName)
        
        const emptyScene = new Scene()
        this.engine.add(loadingSceneName, emptyScene)
        this.engine.goToScene(loadingSceneName)
        
        await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY))
        
        this.cleanupScenes()
        await this.registerScene()
    }

    private async registerScene() {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }
        const scene = new Scene()
        scene.camera.zoom = CAMERA_ZOOM
        this.hud = new HUD()
        this.hud.updateLives(this.availableShips)
        scene.add(this.hud)

        const map = await this.mapRenderer.loadAndRenderMap(scene, 'level1.json')
        const actorFactory = new ActorFactory(map)
        const physics = new Physics(map.map.properties[0].value)
        await actorFactory.createActors(scene)
        
        const shipActor = actorFactory.getShipActor()
        if (shipActor) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
            shipActor.setOnShipDestroyedCallback(() => { this.handleShipLoss() })
        }
        this.engine.add(MAIN_SCENE_NAME, scene)
        this.engine.goToScene(MAIN_SCENE_NAME)
    }

    private async showGameOverScreen() {
        const loadingSceneName = `loading-${Date.now()}`
        this.loadingScenes.push(loadingSceneName)
        
        const emptyScene = new Scene()
        this.engine.add(loadingSceneName, emptyScene)
        this.engine.goToScene(loadingSceneName)
        
        await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY))
        
        this.cleanupScenes()
        
        const gameOverScene = new Scene()
        
        const gameOverMessage = document.createElement('div')
        gameOverMessage.className = 'game-over-message'
        gameOverMessage.innerHTML = `
            <h1>GAME OVER</h1>
            <button id="restart-button">RESTART GAME</button>`
        document.body.appendChild(gameOverMessage)
        
        const restartButton = document.getElementById('restart-button')
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                document.body.removeChild(gameOverMessage)
                this.availableShips = 3
                this.registerScene()
            })
        }
        this.engine.add(GAME_OVER_SCENE_NAME, gameOverScene)
        this.engine.goToScene(GAME_OVER_SCENE_NAME)
    }
}
