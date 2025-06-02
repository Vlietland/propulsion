import { Engine } from 'excalibur'
import { ENGINE_CONFIG } from '@src/game/engine/engineConfig'
import { GameManager } from '@src/game/engine/gameManager'
import { SoundManager } from '@src/game/engine/soundManager'

export class EngineBootstrap {
    public engine: Engine
    private gameManager: GameManager

    constructor() {
        this.engine = new Engine(ENGINE_CONFIG)
        this.gameManager = new GameManager(this.engine)
    }

    async start() {
        console.log('Initializing SoundManager...')
        await SoundManager.initialize()
        console.log('SoundManager initialized, starting game...')
        
        await this.gameManager.start()
        await this.engine.start()
        
        // Test sound system after everything is loaded
        setTimeout(() => {
            console.log('Testing sound system after startup...')
            SoundManager.testSound()
        }, 2000)
    }
}
