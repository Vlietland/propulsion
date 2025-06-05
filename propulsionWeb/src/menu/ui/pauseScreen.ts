import { Engine } from 'excalibur'

export interface PauseScreenOptions {
    onResume: () => void
    onMainMenu?: () => void
}

export class PauseScreen {
    private static instance: PauseScreen | null = null
    private overlayElement!: HTMLElement

    constructor(private engine: Engine, private options: PauseScreenOptions) {
        this.createOverlay()
    }

    private createOverlay(): void {
        const container = document.getElementById('game-container') || document.body
        
        this.overlayElement = document.createElement('div')
        this.overlayElement.className = 'pause-overlay'

        // Title
        const title = document.createElement('h1')
        title.textContent = 'MISSION PAUSED'
        title.className = 'pause-title'

        // Subtitle
        const subtitle = document.createElement('p')
        subtitle.textContent = 'Choose your next action, Commander'
        subtitle.className = 'pause-subtitle'

        // Instructions
        const instructions = document.createElement('p')
        instructions.textContent = 'Press ESC to resume mission'
        instructions.className = 'pause-instructions'

        this.overlayElement.appendChild(title)
        this.overlayElement.appendChild(subtitle)
        this.overlayElement.appendChild(instructions)
        
        container.appendChild(this.overlayElement)
    }

    public show(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'flex'
        }
    }

    public hide(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'none'
        }
    }

    public dispose(): void {
        if (this.overlayElement?.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement)
        }
        PauseScreen.instance = null
    }

    static show(onResume: () => void, onMainMenu?: () => void, engine?: Engine) {
        if (!engine) return
        if (PauseScreen.instance) PauseScreen.instance.dispose()
        PauseScreen.instance = new PauseScreen(engine, {
            onResume,
            onMainMenu
        })
        PauseScreen.instance.show()
    }

    static hideCurrentInstance(): void {
        if (PauseScreen.instance) {
            PauseScreen.instance.hide()
        }
    }

    static disposeCurrentInstance(): void {
        if (PauseScreen.instance) {
            PauseScreen.instance.dispose()
        }
    }
}