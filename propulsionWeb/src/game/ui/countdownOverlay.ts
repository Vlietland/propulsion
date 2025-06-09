import { ScreenElement } from 'excalibur'
import { ReactorActor } from '@src/game/actors/reactorActor'

export class CountdownOverlay extends ScreenElement {
    private overlayElement?: HTMLElement
    private countdownElement?: HTMLElement
    private warningElement?: HTMLElement
    private isVisible: boolean = false
    private reactorActor?: ReactorActor

    constructor(reactorActor?: ReactorActor) {
        super()
        this.reactorActor = reactorActor
        this.createOverlayElements()
        this.overlayElement!.classList.add('hidden')
        if (this.reactorActor) {
            this.reactorActor.addTimerObserver((timeRemaining: number) => {
                this.updateCountdown(timeRemaining)
            })
        }
    }

    private createOverlayElements(): void {
        this.overlayElement = document.createElement('div')
        this.overlayElement.className = 'reactor-countdown-overlay'

        this.warningElement = document.createElement('div')
        this.warningElement.textContent = 'REACTOR CRITICAL'
        this.warningElement.className = 'reactor-warning-text'

        this.countdownElement = document.createElement('div')
        this.countdownElement.className = 'reactor-countdown-number normal'

        this.overlayElement.appendChild(this.warningElement)
        this.overlayElement.appendChild(this.countdownElement)
        
        document.body.appendChild(this.overlayElement)
    }

    updateCountdown(timeRemaining: number): void {
        if (!this.isVisible) this.show()
        const seconds = Math.ceil(timeRemaining)
        this.countdownElement!.textContent = seconds.toString()
        this.countdownElement!.classList.remove('critical', 'warning', 'normal')
        if (seconds <= 5) {
            this.countdownElement!.classList.add('critical')
        } else if (seconds <= 10) {
            this.countdownElement!.classList.add('warning')
        } else {
            this.countdownElement!.classList.add('normal')
        }
    }

    private show(): void {
        this.overlayElement!.classList.remove('hidden')
        this.isVisible = true
    }

    public  dispose(): void {
        if (this.overlayElement?.parentNode) {
            this.overlayElement.parentNode.removeChild(this.overlayElement)
        }
        this.overlayElement = undefined
        this.countdownElement = undefined
        this.warningElement = undefined
    }
}
