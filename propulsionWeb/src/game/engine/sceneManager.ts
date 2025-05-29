import { Scene, Engine, TileMap, Actor } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'
import { HUD } from '@src/game/ui/hud'
import { CollisionManager } from '@src/game/physics/collision/collisionManager'

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
        
        const collisionManager = CollisionManager.instance
        collisionManager.initialize(this.engine)
        
        const tilemapLayers = map.getTileLayers()
        if (tilemapLayers && tilemapLayers.length > 0) {
            collisionManager.processTileMap(tilemapLayers[0])
        }
        
        // 2. Register all actors with the collision system
        collisionManager.registerAllActors(scene)
        
        // 3. Configure collision group relationships
        collisionManager.configureCollisionRelationships()
        
        // 4. Set up collision system updates
        this.setupCollisionSystem(scene, collisionManager)
        
        const shipActor = actorFactory.getShipActor()
        if (shipActor) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
            this.hud.setShip(shipActor)
        }

        this.engine.add('level1', scene)
        this.engine.goToScene('level1')
    }

    private setupCollisionSystem(scene: Scene, collisionManager: CollisionManager): void {
        const collisionSystemActor = new Actor({
            name: 'CollisionSystem'
        })
        
        const originalUpdate = collisionSystemActor.update
        collisionSystemActor.update = function(engine: Engine, delta: number) {
            collisionManager.update(delta)
            originalUpdate.call(this, engine, delta)
        }
        
        scene.add(collisionSystemActor)
    }

    handleShipLoss() {
        this.availableShips -= 1
        if (this.hud) {
            this.hud.updateLives(this.availableShips);
        }
        if (this.availableShips > 0) {
            this.resetScene()
        } else {
            console.log('Game Over!')
            this.showGameOverScreen()
        }
    }

    resetScene() {
        this.engine.goToScene('level1')
    }

    showGameOverScreen() {
        const gameOverScene = new Scene()
        // Add Game Over UI elements here
        this.engine.add('gameOver', gameOverScene)
        this.engine.goToScene('gameOver')
    }
}
