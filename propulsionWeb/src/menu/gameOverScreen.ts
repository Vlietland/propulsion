import { SceneManager } from '@src/game/engine/sceneManager'

export class GameOverScreen {
    static show(score: number, onRestart: () => void, onMainMenu?: () => void) {
        const gameOverMessage = document.createElement('div')
        gameOverMessage.className = 'game-over-message'
        gameOverMessage.innerHTML = `
            <h1>GAME OVER</h1>
            <p>SCORE: ${score}</p>
            <div class="button-container">
                <button id="restart-button">RESTART GAME</button>
                ${onMainMenu ? '<button id="main-menu-button">MAIN MENU</button>' : ''}
            </div>`
        document.body.appendChild(gameOverMessage)

        const restartButton = document.getElementById('restart-button')
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                document.body.removeChild(gameOverMessage)
                onRestart()
            })
        }

        if (onMainMenu) {
            const mainMenuButton = document.getElementById('main-menu-button')
            if (mainMenuButton) {
                mainMenuButton.addEventListener('click', () => {
                    console.log('Main menu button clicked')
                    document.body.removeChild(gameOverMessage)
                    console.log('Calling onMainMenu callback')
                    onMainMenu()
                })
            }
        }
    }
}