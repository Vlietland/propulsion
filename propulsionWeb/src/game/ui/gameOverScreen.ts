import { SceneManager } from '@src/game/engine/sceneManager'

export class GameOverScreen {
    static show(score: number, onRestart: () => void) {
        const gameOverMessage = document.createElement('div')
        gameOverMessage.className = 'game-over-message'
        gameOverMessage.innerHTML = `
            <h1>GAME OVER</h1>
            <p>SCORE: ${score}</p>
            <button id="restart-button">RESTART GAME</button>`
        document.body.appendChild(gameOverMessage)

        const restartButton = document.getElementById('restart-button')
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                document.body.removeChild(gameOverMessage)
                onRestart()
            })
        }
    }
}