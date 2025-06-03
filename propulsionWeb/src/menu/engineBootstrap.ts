import { Engine } from 'excalibur'
import { ENGINE_CONFIG } from '@src/menu/engineConfig'
import { GameManager } from '@src/menu/gameManager'
import { SoundManager } from '@src/game/engine/soundManager'
import { MenuManager } from '@src/menu/menuManager'

export class EngineBootstrap {
    public engine: Engine
    private gameManager: GameManager | null = null
    private menuManager: MenuManager

    constructor() {
        this.engine = new Engine(ENGINE_CONFIG)
        this.menuManager = new MenuManager(this.engine)
    }

    async start() {
        await SoundManager.initialize()
        await this.engine.start()
        this.showMainMenu()
    }

    private showMainMenu(): void {
        this.menuManager.showMainMenu({
            onStartGame: () => this.startGame(),
            onShowOptions: () => this.showOptions(),
            onShowCredits: () => this.showCredits(),
            onExit: () => this.exitGame()
        })
    }

    private async startGame(): Promise<void> {
        this.menuManager.hideMainMenu()
        this.menuManager.setCurrentMenu('game')
        
        if (!this.gameManager) {
            this.gameManager = new GameManager(this.engine, () => this.returnToMainMenu())
        }
        
        await this.gameManager.start()
    }

    private showOptions(): void {
        console.log('Options menu not implemented yet')
    }

    private showCredits(): void {
        console.log('Credits screen not implemented yet')
    }

    private exitGame(): void {
        console.log('Exit game')
        this.engine.stop()
    }

    public returnToMainMenu(): void {
        console.log('returnToMainMenu called')
        if (this.gameManager) {
            console.log('Disposing gameManager')
            this.gameManager.dispose?.()
            this.gameManager = null
        }
        console.log('Calling showMainMenu')
        this.showMainMenu()
    }
}
