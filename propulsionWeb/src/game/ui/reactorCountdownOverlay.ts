import { ScreenElement } from 'excalibur'

export class ReactorCountdownOverlay extends ScreenElement {
    private overlayElement?: HTMLElement
    private countdownElement?: HTMLElement
    private warningElement?: HTMLElement
    private isVisible: boolean = false

    constructor() {
        super()
        this.createOverlayElements()
    }

    private isReady(): boolean {
        return !!(this.overlayElement && this.countdownElement && this.warningElement)
    }

    private createOverlayElements(): void {
        const gameContainer = document.getElementById('game-container')
        if (!gameContainer) {
            console.warn('ReactorCountdownOverlay: game-container element not found')
            return
        }
        
        this.overlayElement = document.createElement('div')
        this.overlayElement.className = 'reactor-countdown-overlay'
        this.overlayElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.1);
            display: none;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            z-index: 1000;
            animation: pulse 1s infinite;
        `

        this.warningElement = document.createElement('div')
        this.warningElement.textContent = 'REACTOR CRITICAL'
        this.warningElement.style.cssText = `
            font-family: 'Courier New', monospace;
            font-size: 3rem;
            font-weight: bold;
            color: #ff0000;
            text-shadow: 0 0 20px #ff0000;
            margin-bottom: 20px;
            animation: flicker 0.5s infinite;
        `

        this.countdownElement = document.createElement('div')
        this.countdownElement.style.cssText = `
            font-family: 'Courier New', monospace;
            font-size: 5rem;
            font-weight: bold;
            color: #ffffff;
            text-shadow: 0 0 30px #ff0000;
            border: 3px solid #ff0000;
            padding: 20px 40px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
        `

        this.overlayElement.appendChild(this.warningElement)
        this.overlayElement.appendChild(this.countdownElement)
        
        this.addAnimationStyles()
        
        gameContainer.appendChild(this.overlayElement)
    }

    private addAnimationStyles(): void {
        if (document.getElementById('reactor-overlay-styles')) return

        const style = document.createElement('style')
        style.id = 'reactor-overlay-styles'
        style.textContent = `
            @keyframes pulse {
                0% { background: rgba(255, 0, 0, 0.1); }
                50% { background: rgba(255, 0, 0, 0.3); }
                100% { background: rgba(255, 0, 0, 0.1); }
            }
            @keyframes flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `
        document.head.appendChild(style)
    }

    show(): void {
        if (!this.isReady()) {
            console.warn('ReactorCountdownOverlay: Cannot show overlay - not properly initialized')
            return
        }
        
        this.overlayElement!.style.display = 'flex'
        this.isVisible = true
    }

    hide(): void {
        if (this.overlayElement) {
            this.overlayElement.style.display = 'none'
            this.isVisible = false
        }
    }

    updateCountdown(timeRemaining: number): void {
        if (!this.isReady()) {
            console.warn('ReactorCountdownOverlay: Cannot update countdown - not properly initialized')
            return
        }
        
        const seconds = Math.ceil(timeRemaining / 1000)
        this.countdownElement!.textContent = seconds.toString()
        
        if (seconds <= 5) {
            this.countdownElement!.style.color = '#ff0000'
            this.countdownElement!.style.fontSize = '6rem'
        } else if (seconds <= 10) {
            this.countdownElement!.style.color = '#ff8800'
            this.countdownElement!.style.fontSize = '5.5rem'
        } else {
            this.countdownElement!.style.color = '#ffffff'
            this.countdownElement!.style.fontSize = '5rem'
        }
    }

    get visible(): boolean {
        return this.isVisible
    }

    dispose(): void {
        if (this.overlayElement?.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement)
        }
        const styles = document.getElementById('reactor-overlay-styles')
        if (styles) {
            styles.remove()
        }
        
        // Clear references
        this.overlayElement = undefined
        this.countdownElement = undefined
        this.warningElement = undefined
    }
}
