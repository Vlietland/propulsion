import { Actor, Vector, ScreenElement, Engine, Scene, World } from 'excalibur'

export class MenuButton extends ScreenElement {
    public actor: Actor
    private isHovered: boolean = false
    private htmlElement!: HTMLElement // Using definite assignment assertion
    private buttonText: string

    constructor(text: string, position: Vector, private action: () => void) {
        super()
        this.buttonText = text
        
        // Create the invisible actor for positioning and collision
        this.actor = new Actor({ pos: position, anchor: Vector.Half })
        
        // Create HTML button element
        this.createHtmlButton(position)
        
        // Add event listeners
        this.setupEventListeners()
    }
    
    private createHtmlButton(position: Vector): void {
        const container = document.getElementById('game-container') || document.body
        
        this.htmlElement = document.createElement('div')
        this.htmlElement.className = 'sci-fi-button'
        this.htmlElement.textContent = this.buttonText
        
        // Position the button absolutely
        this.htmlElement.style.position = 'absolute'
        this.htmlElement.style.left = `${position.x + window.innerWidth / 2 - 150}px` // Center horizontally (button width 300px)
        this.htmlElement.style.top = `${position.y + window.innerHeight / 2 - 25}px`   // Center vertically (button height 50px)
        this.htmlElement.style.zIndex = '1500'
        
        container.appendChild(this.htmlElement)
    }
    
    private setupEventListeners(): void {
        this.htmlElement.addEventListener('click', () => this.action())
        this.htmlElement.addEventListener('mouseenter', () => {
            this.isHovered = true
            this.htmlElement.classList.add('hovered')
        })
        this.htmlElement.addEventListener('mouseleave', () => {
            this.isHovered = false
            this.htmlElement.classList.remove('hovered')
        })
    }
    
    initialize(world: World, scene: Scene<unknown>): void {
        // ScreenElement interface method
    }
    
    update(engine: Engine<any>, elapsed: number): void {
        // ScreenElement interface method - can be used for animations
    }

    public dispose(): void {
        if (this.htmlElement && this.htmlElement.parentNode) {
            this.htmlElement.parentNode.removeChild(this.htmlElement)
        }
        this.actor.kill()
    }
}