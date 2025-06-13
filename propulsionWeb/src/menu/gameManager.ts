import { Engine, Scene, Color } from 'excalibur'
import { ScoreManager } from '@src/scoreManager'
import { LevelManager } from '@src/game/engine/levelManager'
import { SceneManager } from '@src/game/engine/sceneManager'
import { GameOverScreen } from '@src/menu/ui/gameOverScreen'
import { HighScoreScreen } from '@src/menu/ui/highScoreScreen'

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
    private sceneManager?: SceneManager
    private availableShips: number = INITIAL_SHIP_COUNT
    private onReturnToMenu?: () => void
    private gameOverScreen?: GameOverScreen
    private highScoreScreen?: HighScoreScreen
    private engine: Engine
    private blackTransitionScene: Scene

    constructor(engine: Engine, scoreManager: ScoreManager, onReturnToMenu?: () => void) {
        this.scoreManager = scoreManager
        this.levelManager = new LevelManager()
        this.engine = engine
        this.onReturnToMenu = onReturnToMenu
        this.blackTransitionScene = new Scene()
        this.blackTransitionScene.backgroundColor = Color.Black
        this.engine.add('black-transition', this.blackTransitionScene)
    }

    public async start(): Promise<void> {
        this.sceneManager = new SceneManager(this.engine, this.scoreManager, this.levelManager)        
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
        this.engine.goToScene('black-transition')
        await new Promise(resolve => setTimeout(resolve, 100))
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
        const isHighScore = this.scoreManager.highScoreApplicable(this.scoreManager.getScore())
        if (isHighScore) {
            if (!this.highScoreScreen) {
                this.highScoreScreen = new HighScoreScreen(this.engine, this.scoreManager, {
                    onComplete: () => {
                        this.availableShips = INITIAL_SHIP_COUNT
                        this.levelManager.resetToFirstLevel()
                        this.scoreManager.resetScore()
                        this.highScoreScreen?.hide()
                        if (this.onReturnToMenu) this.onReturnToMenu()
                    }
                })
            }
            this.highScoreScreen.show()
        } else {
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
        }
        this.engine.goToScene('black-transition')
        await new Promise(resolve => setTimeout(resolve, 100))
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
        if (this.gameOverScreen) {
            this.gameOverScreen.dispose()
            this.gameOverScreen = undefined
        }
        if (this.highScoreScreen) {
            this.highScoreScreen.dispose()
            this.highScoreScreen = undefined
        }
        
        // Clean up the black transition scene
        if (this.blackTransitionScene) {
            this.blackTransitionScene.clear()
            this.engine.removeScene('black-transition')
        }
    }
}
