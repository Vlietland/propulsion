import { Engine } from 'excalibur'
import { GameManager } from '@src/menu/gameManager'
import { SoundManager } from '@src/game/engine/soundManager'
import { MainMenu } from '@src/menu/mainMenu'
import { DisplayMode, EngineOptions, Color } from 'excalibur'

export const ENGINE_CONFIG: EngineOptions = {
    backgroundColor: Color.Black,
    canvasElementId: 'game',
    antialiasing: false,
    pixelArt: true,
    displayMode: DisplayMode.FitScreenAndFill,
}

export class EngineBootstrap {
    public engine: Engine
    private gameManager: GameManager | null = null
    private mainMenu: MainMenu | null = null

    constructor() { this.engine = new Engine(ENGINE_CONFIG) }

    async start() {
        await SoundManager.initialize()
        await this.engine.start()
        this.showMainMenu()
    }

    private showMainMenu(): void {
        if (!this.mainMenu) {
            this.mainMenu = new MainMenu(this.engine, {
                onStartGame: () => this.startGame(),
                onShowHighScore: () => this.showHighScore(),
                onShowCredits: () => this.showCredits(),
                onExit: () => this.exitGame()
            })
        }
        this.mainMenu.show()
    }

    private async startGame(): Promise<void> {
        if (this.mainMenu) this.mainMenu.hide()
        if (!this.gameManager) this.gameManager = new GameManager(this.engine, () => this.returnToMainMenu())
        await this.gameManager.start()
    }

    private showHighScore(): void { 
        console.log('Options menu not implemented yet')
    }

    private showCredits(): void {
        console.log('Credits screen not implemented yet')
    }

    private exitGame(): void { this.engine.stop() }

    public returnToMainMenu(): void {
        if (this.gameManager) {
            this.gameManager.dispose?.()
            this.gameManager = null
        }
        this.showMainMenu()
    }
}
