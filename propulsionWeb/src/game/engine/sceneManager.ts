import { Scene, Engine } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { ActorFactory } from '@src/game/actors/actorFactory'
import { ShipController } from '@src/game/controller/shipController'
import { Physics } from '@src/game/physics/physics'

export class SceneManager {
    private mapRenderer: MapRenderer

    constructor(private engine: Engine) {
        this.mapRenderer = new MapRenderer()
    }

    async registerScenes() {
        const scene = new Scene()

        const map = await this.mapRenderer.loadAndRenderMap(scene, 'level1.json')
        const actorFactory = new ActorFactory(map)
        const physics = new Physics(10)

        await actorFactory.createActors(scene)
        const shipActor = actorFactory.getShipActor()

        if (shipActor) {
            shipActor.setPhysics(physics)
            shipActor.setshipController(new ShipController(this.engine))
            shipActor.setCamera(scene.camera)
        }

        this.engine.add('level1', scene)
        this.engine.goToScene('level1')
    }
}
