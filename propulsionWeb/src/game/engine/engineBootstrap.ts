import { Engine } from 'excalibur'
import { ENGINE_CONFIG } from '@src/game/engine/engineConfig'
import { SceneManager } from '@src/game/engine/sceneManager'

export class EngineBootstrap {
    public engine: Engine
    private sceneManager: SceneManager

    constructor() {
        this.engine = new Engine(ENGINE_CONFIG)
        this.sceneManager = new SceneManager(this.engine)
    }

    async start() {
        await this.sceneManager.registerScenes()
        await this.engine.start()
    }
}
