import { Scene, Vector, Color, Actor, Rectangle, Text, Font, FontUnit, Keys } from 'excalibur'
import { SoundManager } from '@src/game/engine/soundManager'

export interface MainMenuOptions {
    onStartGame: () => void
    onShowOptions?: () => void
    onShowCredits?: () => void
    onExit?: () => void
}

export class MainMenu {
    private scene: Scene
    private buttons: MenuButton[] = []
    private selectedIndex: number = 0
    private background: Actor | null = null
    private title: Actor | null = null
    private isActive: boolean = false
    private inputSetup: boolean = false

    constructor(private options: MainMenuOptions) {
        this.scene = new Scene()
        this.scene.camera.pos = new Vector(0, 0)
        this.setupBackground()
        this.setupTitle()
        this.setupButtons()
    }

    private setupBackground(): void {
        this.background = new Actor({
            pos: new Vector(0, 0),
            anchor: Vector.Zero,
            width: 2000,
            height: 2000,
            z: -100
        })

        const bgRect = new Rectangle({
            width: 2000,
            height: 2000,
            color: new Color(10, 10, 30)
        })

        this.background.graphics.use(bgRect)
        this.scene.add(this.background)

        this.addStarField()
    }

    private addStarField(): void {
        for (let i = 0; i < 100; i++) {
            const star = new Actor({
                pos: new Vector(
                    Math.random() * 1600 - 800,
                    Math.random() * 1200 - 600
                ),
                anchor: Vector.Half,
                z: -50
            })

            const size = Math.random() * 3 + 1
            const brightness = Math.random() * 0.8 + 0.2
            const starRect = new Rectangle({
                width: size,
                height: size,
                color: new Color(255 * brightness, 255 * brightness, 255, brightness)
            })

            star.graphics.use(starRect)
            this.scene.add(star)

            star.on('preupdate', () => {
                star.graphics.opacity = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.3
            })
        }
    }

    private setupTitle(): void {
        this.title = new Actor({
            pos: new Vector(0, -150),
            anchor: Vector.Half,
            z: 10
        })

        const titleText = new Text({
            text: 'PROPULSION',
            color: new Color(0, 200, 255),
            font: new Font({
                family: 'monospace',
                size: 48,
                unit: FontUnit.Px
            })
        })

        this.title.graphics.use(titleText)
        this.scene.add(this.title)

        let glowIntensity = 0
        this.title.on('preupdate', () => {
            glowIntensity += 0.05
            const glow = 0.3 + Math.sin(glowIntensity) * 0.2
            this.title!.graphics.opacity = glow
        })
    }

    private setupButtons(): void {
        const buttonConfigs = [
            { text: 'START GAME', action: this.options.onStartGame },
            { text: 'OPTIONS', action: this.options.onShowOptions || (() => {}) },
            { text: 'CREDITS', action: this.options.onShowCredits || (() => {}) },
            { text: 'EXIT', action: this.options.onExit || (() => {}) }
        ]

        const startY = 50 // Start buttons below the title
        buttonConfigs.forEach((config, index) => {
            const button = new MenuButton(
                config.text,
                new Vector(0, startY + index * 60),
                config.action,
                index === 0
            )
            this.buttons.push(button)
            this.scene.add(button.actor)
        })
    }

    private setupInput(): void {
        this.scene.input.keyboard.on('press', (evt) => {
            if (!this.isActive) return

            switch (evt.key) {
                case Keys.ArrowUp:
                case Keys.W:
                    this.navigateUp()
                    break
                case Keys.ArrowDown:
                case Keys.S:
                    this.navigateDown()
                    break
                case Keys.Enter:
                case Keys.Space:
                    this.activateSelected()
                    break
                case Keys.Escape:
                    if (this.options.onExit) this.options.onExit()
                    break
            }
        })
    }

    private navigateUp(): void {
        this.buttons[this.selectedIndex].setSelected(false)
        this.selectedIndex = (this.selectedIndex - 1 + this.buttons.length) % this.buttons.length
        this.buttons[this.selectedIndex].setSelected(true)
        // SoundManager could play a menu navigation sound here
    }

    private navigateDown(): void {
        this.buttons[this.selectedIndex].setSelected(false)
        this.selectedIndex = (this.selectedIndex + 1) % this.buttons.length
        this.buttons[this.selectedIndex].setSelected(true)
        // SoundManager could play a menu navigation sound here
    }

    private activateSelected(): void {
        const selectedButton = this.buttons[this.selectedIndex]
        selectedButton.activate()
        // SoundManager could play a button activation sound here
    }

    public getScene(): Scene {
        return this.scene
    }

    public setActive(active: boolean): void {
        this.isActive = active
        if (active && this.scene.input && !this.inputSetup) {
            this.setupInput()
            this.inputSetup = true
        }
    }

    public dispose(): void {
        this.buttons.forEach(button => button.dispose())
        this.buttons = []
        this.scene.clear()
    }
}

class MenuButton {
    public actor: Actor
    private textGraphic!: Text
    private backgroundRect!: Rectangle
    private isSelected: boolean = false
    private pulsePhase: number = 0

    constructor(
        private text: string,
        private position: Vector,
        private action: () => void,
        selected: boolean = false
    ) {
        this.isSelected = selected
        this.actor = new Actor({
            pos: position,
            anchor: Vector.Half,
            z: 5
        })

        this.setupGraphics()
        this.setupClickHandler()
    }

    private setupGraphics(): void {
        this.backgroundRect = new Rectangle({
            width: 300,
            height: 50,
            color: this.isSelected ? new Color(0, 100, 200, 50) : new Color(0, 50, 100, 30),
            strokeColor: this.isSelected ? new Color(0, 200, 255) : new Color(100, 150, 200),
            lineWidth: 2
        })

        this.textGraphic = new Text({
            text: this.text,
            color: this.isSelected ? new Color(255, 255, 255) : new Color(180, 180, 180),
            font: new Font({
                family: 'monospace',
                size: 20,
                unit: FontUnit.Px
            })
        })

        this.actor.graphics.add(this.backgroundRect)
        this.actor.graphics.add(this.textGraphic)

        this.actor.on('preupdate', () => {
            if (this.isSelected) {
                this.pulsePhase += 0.1
                const pulse = 0.7 + Math.sin(this.pulsePhase) * 0.3
                this.actor.graphics.opacity = pulse
            } else {
                this.actor.graphics.opacity = 0.8
            }
        })
    }

    private setupClickHandler(): void {
        this.actor.on('pointerdown', () => {
            this.activate()
        })

        this.actor.on('pointerenter', () => {
            if (!this.isSelected) {
                this.textGraphic.color = new Color(220, 220, 220)
                this.backgroundRect.strokeColor = new Color(150, 200, 255)
            }
        })

        this.actor.on('pointerleave', () => {
            if (!this.isSelected) {
                this.textGraphic.color = new Color(180, 180, 180)
                this.backgroundRect.strokeColor = new Color(100, 150, 200)
            }
        })
    }

    public setSelected(selected: boolean): void {
        this.isSelected = selected
        
        if (selected) {
            this.backgroundRect.color = new Color(0, 100, 200, 50)
            this.backgroundRect.strokeColor = new Color(0, 200, 255)
            this.textGraphic.color = new Color(255, 255, 255)
        } else {
            this.backgroundRect.color = new Color(0, 50, 100, 30)
            this.backgroundRect.strokeColor = new Color(100, 150, 200)
            this.textGraphic.color = new Color(180, 180, 180)
        }
    }

    public activate(): void {
        this.action()
    }

    public dispose(): void {
        this.actor.kill()
    }
}
