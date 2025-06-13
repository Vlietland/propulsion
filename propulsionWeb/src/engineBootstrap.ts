import { Engine } from 'excalibur'
import { GameManager } from '@src/menu/gameManager'
import { SoundManager } from '@src/game/engine/soundManager'
import { MainMenu } from '@src/menu/mainMenu'
import { BriefingScreen } from '@src/menu/ui/briefingScreen'
import { ControlsScreen } from '@src/menu/ui/controlsScreen'
import { CreditsScreen } from '@src/menu/ui/creditsScreen'
import { HallOfFameScreen } from '@src/menu/ui/hallOfFameScreen'
import { ScoreManager } from '@src/scoreManager'
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
    private briefingScreen: BriefingScreen | null = null
    private controlsScreen: ControlsScreen | null = null
    private creditsScreen: CreditsScreen | null = null
    private hallOfFameScreen: HallOfFameScreen | null = null
    private scoreManager: ScoreManager

    constructor() { 
        this.engine = new Engine(ENGINE_CONFIG)
        this.scoreManager = new ScoreManager()
    }

    async start() {
        await SoundManager.initialize()
        await this.engine.start()
        this.showMainMenu()
    }

    private showMainMenu(): void {
        if (!this.mainMenu) {
            this.mainMenu = new MainMenu(this.engine, {
                onStartGame: () => this.startGame(),
                onShowBriefing: () => this.showBriefing(),
                onShowControls: () => this.showControls(),
                onShowHighScore: () => this.showHighScore(),
                onShowCredits: () => this.showCredits()
            })
        }
        this.mainMenu.show()
    }

    private async startGame(): Promise<void> {
        if (this.mainMenu) {
            this.mainMenu.hide()
        }
        if (!this.gameManager) this.gameManager = new GameManager(this.engine, this.scoreManager, () => this.returnToMainMenu())
        await this.gameManager.start()
    }

    private showBriefing(): void {
        if (this.mainMenu) {
            this.mainMenu.hide()
        }
        if (!this.briefingScreen) {
            this.briefingScreen = new BriefingScreen(this.engine, () => this.returnToMainMenu())
        }
        this.briefingScreen.show()
    }

    private showControls(): void {
        if (this.mainMenu) {
            this.mainMenu.hide()
        }
        if (!this.controlsScreen) {
            this.controlsScreen = new ControlsScreen(this.engine, () => this.returnToMainMenu())
        }
        this.controlsScreen.show()
    }

    private showHighScore(): void {
        if (this.mainMenu) {
            this.mainMenu.hide()
        }
        if (!this.hallOfFameScreen) {
            this.hallOfFameScreen = new HallOfFameScreen(this.engine, this.scoreManager, () => this.returnToMainMenu())
        }
        this.hallOfFameScreen.show()
    }

    private showCredits(): void {
        if (this.mainMenu) {
            this.mainMenu.hide()
        }
        if (!this.creditsScreen) {
            this.creditsScreen = new CreditsScreen(this.engine, () => this.returnToMainMenu())
        }
        this.creditsScreen.show()
    }

    public returnToMainMenu(): void {
        this.showMainMenu()

    }
}
