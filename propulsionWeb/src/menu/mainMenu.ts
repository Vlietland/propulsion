import { Scene, Vector, Color, Actor, Rectangle, Text, Font, FontUnit, Keys, Engine } from 'excalibur'

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
    private isActive: boolean = false
    private sceneName = 'main-menu'

    constructor(private engine: Engine, private options: MainMenuOptions) {
        this.scene = new Scene()
        // Position camera to center of screen instead of (0,0)
        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)
        this.scene.camera.pos = screenCenter
        this.createBackground()
        this.createTitle()
        this.createButtons()
        // Input setup will be done in show() method when scene is added to engine
    }

    private createBackground(): void {
        // Get screen dimensions for proper background sizing
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        
        // Simple dark space background - positioned at camera center
        const background = new Actor({
            pos: new Vector(screenWidth / 2, screenHeight / 2),
            anchor: Vector.Half,
            width: screenWidth,
            height: screenHeight,
            z: -100
        })

        background.graphics.use(new Rectangle({
            width: screenWidth,
            height: screenHeight,
            color: new Color(10, 10, 30)
        }))

        this.scene.add(background)

        // Simple starfield
        for (let i = 0; i < 50; i++) {
            const star = new Actor({
                pos: new Vector(
                    Math.random() * screenWidth,
                    Math.random() * screenHeight
                ),
                anchor: Vector.Half,
                z: -50
            })

            star.graphics.use(new Rectangle({
                width: 2,
                height: 2,
                color: Color.White
            }))

            this.scene.add(star)
        }
    }

    private createTitle(): void {
        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)
        
        const title = new Actor({
            pos: new Vector(screenCenter.x, screenCenter.y - 150),
            anchor: Vector.Half,
            z: 10
        })

        title.graphics.use(new Text({
            text: 'PROPULSION',
            color: new Color(0, 200, 255),
            font: new Font({
                family: 'monospace',
                size: 48,
                unit: FontUnit.Px
            })
        }))

        this.scene.add(title)
    }

    private createButtons(): void {
        const buttonConfigs = [
            { text: 'START GAME', action: this.options.onStartGame },
            { text: 'OPTIONS', action: this.options.onShowOptions || (() => {}) },
            { text: 'CREDITS', action: this.options.onShowCredits || (() => {}) },
            { text: 'EXIT', action: this.options.onExit || (() => {}) }
        ]

        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)

        buttonConfigs.forEach((config, index) => {
            const button = new MenuButton(
                config.text,
                new Vector(screenCenter.x, screenCenter.y + 50 + index * 60),
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
                    this.buttons[this.selectedIndex].setSelected(false)
                    this.selectedIndex = (this.selectedIndex - 1 + this.buttons.length) % this.buttons.length
                    this.buttons[this.selectedIndex].setSelected(true)
                    break
                case Keys.ArrowDown:
                case Keys.S:
                    this.buttons[this.selectedIndex].setSelected(false)
                    this.selectedIndex = (this.selectedIndex + 1) % this.buttons.length
                    this.buttons[this.selectedIndex].setSelected(true)
                    break
                case Keys.Enter:
                case Keys.Space:
                    this.buttons[this.selectedIndex].activate()
                    break
                case Keys.Escape:
                    if (this.options.onExit) this.options.onExit()
                    break
            }
        })
    }

    public show(): void {
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
        this.setupInput()
        this.isActive = true
    }

    public hide(): void {
        this.isActive = false
    }

    public dispose(): void {
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}

class MenuButton {
    public actor: Actor
    private textGraphic!: Text
    private backgroundRect!: Rectangle
    private isSelected: boolean = false

    constructor(
        private text: string,
        position: Vector,
        private action: () => void,
        selected: boolean = false
    ) {
        this.isSelected = selected
        this.actor = new Actor({
            pos: position,
            anchor: Vector.Half,
            z: 5
        })

        this.createGraphics()
        this.setupPointerEvents()
    }

    private createGraphics(): void {
        this.backgroundRect = new Rectangle({
            width: 300,
            height: 50,
            color: this.isSelected ? new Color(0, 100, 200, 80) : new Color(0, 50, 100, 40),
            strokeColor: this.isSelected ? new Color(0, 200, 255) : new Color(100, 150, 200),
            lineWidth: 2
        })

        this.textGraphic = new Text({
            text: this.text,
            color: this.isSelected ? Color.White : new Color(180, 180, 180),
            font: new Font({
                family: 'monospace',
                size: 20,
                unit: FontUnit.Px
            })
        })

        this.actor.graphics.add(this.backgroundRect)
        this.actor.graphics.add(this.textGraphic)
    }

    private setupPointerEvents(): void {
        this.actor.on('pointerdown', () => this.activate())
        
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
        
        this.backgroundRect.color = selected ? new Color(0, 100, 200, 80) : new Color(0, 50, 100, 40)
        this.backgroundRect.strokeColor = selected ? new Color(0, 200, 255) : new Color(100, 150, 200)
        this.textGraphic.color = selected ? Color.White : new Color(180, 180, 180)
    }

    public activate(): void {
        this.action()
    }

    public dispose(): void {
        this.actor.kill()
    }
}