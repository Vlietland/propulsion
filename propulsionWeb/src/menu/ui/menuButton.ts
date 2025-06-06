import { Actor, Vector, ScreenElement, Engine, Scene, World } from 'excalibur'

export class MenuButton extends ScreenElement {
    public actor: Actor
    private htmlElement!: HTMLElement
    public buttonText: string

    constructor(text: string, position: Vector, private action: () => void) {
        super()
        this.buttonText = text
        this.actor = new Actor({ pos: position, anchor: Vector.Half })
        this.createHtmlButton(position)
        this.setupEventListeners()
    }
    
    private createHtmlButton(position: Vector): void {
        const container = document.getElementById('game-container') || document.body
        
        this.htmlElement = document.createElement('div')
        this.htmlElement.className = 'sci-fi-button'
        this.htmlElement.textContent = this.buttonText
        
        this.htmlElement.style.position = 'absolute'
        this.htmlElement.style.left = `${position.x + window.innerWidth / 2 - 150}px`
        this.htmlElement.style.top = `${position.y + window.innerHeight / 2 - 25}px`
        this.htmlElement.style.zIndex = '1500'
        
        container.appendChild(this.htmlElement)
    }
    
    private setupEventListeners(): void {
        this.htmlElement.addEventListener('click', () => this.action())
        this.htmlElement.addEventListener('mouseenter', () => {
            this.htmlElement.classList.add('hovered')
        })
        this.htmlElement.addEventListener('mouseleave', () => {
            this.htmlElement.classList.remove('hovered')
        })
    }
    
    public dispose(): void {
        if (this.htmlElement?.parentNode) {
            this.htmlElement.parentNode.removeChild(this.htmlElement)
        }
        this.actor.kill()
    }

    public hide(): void {
        if (this.htmlElement) {
            this.htmlElement.style.display = 'none'
        }
    }

    public show(): void {
        if (this.htmlElement) {
            this.htmlElement.style.display = 'block'
        }
    }

    public isVisible(): boolean {
        return this.htmlElement ? this.htmlElement.style.display !== 'none' : false
    }
}