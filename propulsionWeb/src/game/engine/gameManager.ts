import { Engine, Scene } from 'excalibur'
import { ScoreManager } from '@src/game/engine/scoreManager'
import { LevelManager } from '@src/game/engine/levelManager'
import { SceneManager } from '@src/game/engine/sceneManager'
import { GameOverScreen } from '@src/game/ui/gameOverScreen'

const EXPLOSION_DELAY = 2500
const HYPERSPACE_DELAY = 2500
const MISSION_FAILED_SCORE = -1000
const MISSION_SUCCESS_SCORE = 2000

export class GameManager {
    private scoreManager: ScoreManager
    private levelManager: LevelManager
    private sceneManager: SceneManager
    private availableShips: number = 3

    constructor(private engine: Engine) {
        this.scoreManager = new ScoreManager()
        this.levelManager = new LevelManager()
        this.sceneManager = new SceneManager(engine, this.scoreManager, this.levelManager)
    }

    async start(): Promise<void> {
        await this.sceneManager.registerScene(this.availableShips, {
            onShipLost: () => this.handleShipLost(),
            onMissionFinished: () => this.handleMissionFinished()
        })
    }

    private handleShipLost(): void {
        this.availableShips -= 1
        setTimeout(() => {
            if (this.availableShips > 0) {
                this.restartSceneManager()
            } else {
                this.handleGameOver()
            }
        }, EXPLOSION_DELAY)
    }
    
    private handleMissionFinished(): void {
        const shipActor = this.sceneManager.getShipActor()
        if (shipActor) {
            if (shipActor.isBallConnected()) {
                this.levelManager.nextLevel()
                this.scoreManager.addScore(MISSION_SUCCESS_SCORE)
            } else {
                this.scoreManager.addScore(MISSION_FAILED_SCORE)
            }
            shipActor.kill()
        }
        setTimeout(() => {
            this.restartSceneManager()
        }, HYPERSPACE_DELAY)
    }

    private async restartSceneManager(): Promise<void> {
        this.purgeSceneManager()
        this.sceneManager = new SceneManager(this.engine, this.scoreManager, this.levelManager)
        await this.sceneManager.registerScene(this.availableShips, {
            onShipLost: () => this.handleShipLost(),
            onMissionFinished: () => this.handleMissionFinished()
        })
    }

    private purgeSceneManager(): void {
        if (this.sceneManager && typeof this.sceneManager.dispose === 'function') {
            this.sceneManager.dispose()
        }
        this.sceneManager = null as any
    }

    private async handleGameOver(): Promise<void> {
        await this.sceneManager.showGameOverScene()
        GameOverScreen.show(this.scoreManager.getScore(), () => {
            this.availableShips = 3
            this.levelManager.resetToFirstLevel()
            this.scoreManager.resetScore()
            this.restartSceneManager()
        })
    }

    getScoreManager(): ScoreManager {
        return this.scoreManager
    }

    getLevelManager(): LevelManager {
        return this.levelManager
    }
}
