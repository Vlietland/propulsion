import { Engine, Scene } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'
import { LevelManager } from '@src/game/engine/levelManager'
import { SceneManager } from '@src/game/engine/sceneManager'
import { GameOverScreen } from '@src/menu/ui/gameOverScreen'

const EXPLOSION_DELAY = 2000
const HYPERSPACE_DELAY = 1500
const INITIAL_SHIP_COUNT = 1

const MISSION_FAILED_SCORE = -1000
const MISSION_SUCCESS_SCORE = 2000

export enum GameResult {
    ShipLost = 'shiplost',
    ShipHyperspace = 'shiphyperspace',
    ShipBallHyperspace = 'shipballhyperspace'
}

export class GameManager {
    private scoreManager: ScoreManager
    private levelManager: LevelManager
    private sceneManager: SceneManager
    private availableShips: number = INITIAL_SHIP_COUNT
    private onReturnToMenu?: () => void
    private gameOverScreen?: GameOverScreen

    constructor(private engine: Engine, scoreManager: ScoreManager, onReturnToMenu?: () => void) {
        this.scoreManager = scoreManager
        this.levelManager = new LevelManager()
        this.sceneManager = new SceneManager(engine, this.scoreManager, this.levelManager)
        this.onReturnToMenu = onReturnToMenu
    }

    public async start(): Promise<void> {
        await this.sceneManager.registerScene(this.availableShips, {
            onGameResult: (result: GameResult) => this.handleGameResult(result)
        })
    }

    private handleGameResult(result: GameResult): void {
        switch (result) {
            case GameResult.ShipLost:
                this.availableShips -= 1
                setTimeout(async () => {
                    if (this.availableShips > 0) {
                        await this.restartSceneManager()
                    } else {
                        await this.handleGameOver()
                    }
                }, EXPLOSION_DELAY)
                break
            case GameResult.ShipBallHyperspace:
                this.levelManager.nextLevel()
                this.scoreManager.addScore(MISSION_SUCCESS_SCORE)
                this.availableShips += 1
                setTimeout(async () => {
                    await this.restartSceneManager()
                }, HYPERSPACE_DELAY)
                break
            case GameResult.ShipHyperspace:
                this.scoreManager.addScore(MISSION_FAILED_SCORE)
                setTimeout(async () => {
                    await this.restartSceneManager()
                }, HYPERSPACE_DELAY)
                break
        }
    }

    private async restartSceneManager(): Promise<void> {
        if (this.sceneManager && typeof this.sceneManager.dispose === 'function') {
            this.sceneManager.dispose()
        }
        this.sceneManager = null as any
        this.sceneManager = new SceneManager(this.engine, this.scoreManager, this.levelManager)
        await this.sceneManager.registerScene(this.availableShips, {
            onGameResult: (result: GameResult) => this.handleGameResult(result)
        })
    }

    private async handleGameOver(): Promise<void> {
        if (!this.gameOverScreen) {
            this.gameOverScreen = new GameOverScreen(this.engine, this.scoreManager, {
                onRestart: () => {
                    this.availableShips = INITIAL_SHIP_COUNT
                    this.levelManager.resetToFirstLevel()
                    this.scoreManager.resetScore()
                    this.gameOverScreen?.hide()
                    this.restartSceneManager()
                },
                onMainMenu: this.onReturnToMenu ? () => {
                    this.gameOverScreen?.hide()                    
                    this.onReturnToMenu!()
                } : undefined
            })
        }
        this.gameOverScreen.show()
        
        if (this.sceneManager && typeof this.sceneManager.dispose === 'function') {
            this.sceneManager.dispose()
        }
        this.sceneManager = null as any
    }

    public dispose(): void {
        if (this.sceneManager && typeof this.sceneManager.dispose === 'function') {
            this.sceneManager.dispose()
        }
        this.sceneManager = null as any
    }
}
