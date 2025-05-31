import { Scene, Engine, TileMap, Actor } from 'excalibur'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'
import { GameOverScreen } from '@src/game/ui/gameOverScreen'
import { Hyperspace } from '@src/game/physics/hyperspace'
import { ShipActor } from '../actors/ship/shipActor'
import { LevelManager } from '@src/game/engine/levelManager'

const CAMERA_ZOOM = 0.8
const MAIN_SCENE_NAME = 'level1'
const GAME_OVER_SCENE_NAME = 'gameOver'
const TRANSITION_DELAY = 50
const EXPLOSION_DELAY = 2500
const HYPERSPACE_DELAY = 2500

export class SceneManager {
    private levelManager: LevelManager
    private hud?: HUD
    private availableShips: number = 3
    private loadingScenes: string[] = []
    private shipActor?: ShipActor

    constructor(private engine: Engine) {
        this.levelManager = new LevelManager()
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
        if (this.shipActor) {
            if (this.shipActor.isBallConnected()) {

                this.levelManager.nextLevel()
            }
            else {
                console.log('Ball is not connected, mission failed')
            }
            this.shipActor.kill()
        }
        setTimeout(() => { this.resetScene() }, HYPERSPACE_DELAY)
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

        await this.levelManager.ensureInitialized()
        const map = await this.levelManager.getMap(scene)
        const hyperspace = new Hyperspace(map)
        const actorFactory = new ActorFactory(map, hyperspace)
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
            this.levelManager.resetToFirstLevel()
            this.registerScene()
        })
    }
}
