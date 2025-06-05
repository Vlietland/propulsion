import { Engine, Scene } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'
import { LevelManager } from '@src/game/engine/levelManager'
import { SceneManager } from '@src/game/engine/sceneManager'
import { GameOverScreen } from '@src/menu/ui/gameOverScreen'

const EXPLOSION_DELAY = 2000
const HYPERSPACE_DELAY = 1500
const INITIAL_SHIP_COUNT = 3

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
                setTimeout(() => {
                    if (this.availableShips > 0) {
                        this.restartSceneManager()
                    } else {
                        this.handleGameOver()
                    }
                }, EXPLOSION_DELAY)
                break
            case GameResult.ShipBallHyperspace:
                this.levelManager.nextLevel()
                this.scoreManager.addScore(MISSION_SUCCESS_SCORE)
                setTimeout(() => {
                    this.restartSceneManager()
                }, HYPERSPACE_DELAY)
                break
            case GameResult.ShipHyperspace:
                this.scoreManager.addScore(MISSION_FAILED_SCORE)
                setTimeout(() => {
                    this.restartSceneManager()
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
        await this.sceneManager.showGameOverScene()
        
        const finalScore = this.scoreManager.getScore()
        const isHighScore = this.scoreManager.highScoreApplicable(finalScore)
        
        GameOverScreen.show(
            finalScore, 
            isHighScore,
            () => {
                GameOverScreen.hideCurrentInstance()
                this.availableShips = INITIAL_SHIP_COUNT
                this.levelManager.resetToFirstLevel()
                this.scoreManager.resetScore()
                this.restartSceneManager()
            },
            this.onReturnToMenu ? () => {
                GameOverScreen.hideCurrentInstance()
                this.dispose()
                this.onReturnToMenu!()
            } : undefined,
            (name: string) => {
                this.scoreManager.addHighScore(finalScore, name)
            },
            this.engine
        )
    }

    public dispose(): void {
        if (this.sceneManager && typeof this.sceneManager.dispose === 'function') {
            this.sceneManager.dispose()
        }
        this.sceneManager = null as any
    }
}
