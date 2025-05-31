import { Scene, Engine, TileMap, Actor } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'
import { GameOverScreen } from '@src/game/ui/gameOverScreen'
import { Hyperspace } from '@src/game/physics/hyperspace'

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
        this.engine.remove(MAIN_SCENE_NAME)
        this.loadingScenes = []
    }

    private handleShipLost() {
        this.availableShips -= 1
        if (this.hud) this.hud.updateLives(this.availableShips)
        setTimeout(() => {
            if (this.availableShips > 0) this.resetScene()
            else this.handleGameOver()
        }, EXPLOSION_DELAY)
    }
    
    private handleMissionFinished() {

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
        const hyperspace = new Hyperspace(map)
        const actorFactory = new ActorFactory(map, hyperspace)
        const gravity = map?.map?.properties?.find((p: any) => p.name === 'gravity')
        const enemyLevel = map?.map?.properties?.find((p: any) => p.name === 'enemyLevel')
        const physics = new Physics(gravity.value || 0)
        await actorFactory.createActors(scene, enemyLevel.value)
        
        const shipActor = actorFactory.getShipActor()
        if (shipActor) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
            shipActor.setShipLostCallback(() => { this.handleShipLost() })
            shipActor.setMissionFinishedCallback(() => { this.handleMissionFinished() })            
        }
        this.engine.add(MAIN_SCENE_NAME, scene)
        this.engine.goToScene(MAIN_SCENE_NAME)
    }

    private async handleGameOver() {
        const loadingSceneName = `loading-${Date.now()}`
        this.loadingScenes.push(loadingSceneName)
        
        const emptyScene = new Scene()
        this.engine.add(loadingSceneName, emptyScene)
        this.engine.goToScene(loadingSceneName)
        
        await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY))
        
        this.cleanupScenes()
        
        const gameOverScene = new Scene()
        this.engine.add(GAME_OVER_SCENE_NAME, gameOverScene)
        this.engine.goToScene(GAME_OVER_SCENE_NAME)
        
        GameOverScreen.show(() => {
            this.availableShips = 3
            this.registerScene()
        })
    }
}
