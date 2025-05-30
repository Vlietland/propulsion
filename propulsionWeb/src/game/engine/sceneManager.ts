import { Scene, Engine, TileMap, Actor } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'

const CAMERA_ZOOM = 0.8

export class SceneManager {
    private mapRenderer: MapRenderer
    private hud?: HUD
    private availableShips: number = 3

    constructor(private engine: Engine) {
        this.mapRenderer = new MapRenderer()
    }

    async registerScene() {
        if (this.hud) {
            this.hud.dispose()
            this.hud = undefined
        }
        const scene = new Scene()
        scene.camera.zoom = CAMERA_ZOOM
        this.hud = new HUD()
        this.hud.updateLives(this.availableShips);
        scene.add(this.hud)

        const map = await this.mapRenderer.loadAndRenderMap(scene, 'level1.json');

        const actorFactory = new ActorFactory(map)
        const physics = new Physics(map.map.properties[0].value)
        await actorFactory.createActors(scene)
        
        const tilemapLayers = map.getTileLayers()
        
        const shipActor = actorFactory.getShipActor()
        if (shipActor) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
            shipActor.setOnShipDestroyedCallback(() => { this.handleShipLoss() })
        }

        this.engine.add('level1', scene)
        this.engine.goToScene('level1')
    }

    handleShipLoss() {
        this.availableShips -= 1
        if (this.hud) this.hud.updateLives(this.availableShips)
        if (this.availableShips > 0) this.resetScene()
        else this.showGameOverScreen()
    }

    private async resetScene() {
        //this.engine.remove('level1')        
        this.registerScene
    }

    private showGameOverScreen() {
        this.engine.remove('gameOver')
        const gameOverScene = new Scene()
        this.engine.add('gameOver', gameOverScene)
        this.engine.goToScene('gameOver')
    }
}
