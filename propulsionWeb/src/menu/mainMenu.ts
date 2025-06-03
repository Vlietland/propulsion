import { Scene, Vector, Color, Actor, Rectangle, Text, Font, FontUnit, Engine } from 'excalibur'

export interface MainMenuOptions {
    onStartGame: () => void
    onShowHighScore?: () => void
    onShowCredits?: () => void
    onExit?: () => void
}

export class MainMenu {
    private scene: Scene
    private buttons: MenuButton[] = []
    private isActive: boolean = false
    private sceneName = 'main-menu'

    constructor(private engine: Engine, private options: MainMenuOptions) {
        this.scene = new Scene()
        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)
        this.scene.camera.pos = screenCenter
        this.createBackground()
        this.createTitle()
        this.createButtons()
    }

    private createBackground(): void {
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        const background = new Actor({
            pos: new Vector(screenWidth / 2, screenHeight / 2),
            anchor: Vector.Half, width: screenWidth, height: screenHeight, z: -100
        })
        background.graphics.use(new Rectangle({ width: screenWidth, height: screenHeight, color: new Color(10, 10, 30)}))
        this.scene.add(background)
        for (let i = 0; i < 50; i++) {
            const star = new Actor({
                pos: new Vector(Math.random() * screenWidth, Math.random() * screenHeight                ),
                anchor: Vector.Half, z: -50
            })
            star.graphics.use(new Rectangle({ width: 2, height: 2, color: Color.White}))
            this.scene.add(star)
        }
    }

    private createTitle(): void {
        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)
        const title = new Actor({ pos: new Vector(screenCenter.x, screenCenter.y - 150), anchor: Vector.Half, z: 10 })
        title.graphics.use(new Text({
            text: 'PROPULSION', color: new Color(0, 200, 255),
            font: new Font({ family: 'monospace', size: 48, unit: FontUnit.Px })
        }))
        this.scene.add(title)
    }

    private createButtons(): void {
        const buttonConfigs = [
            { text: 'START GAME', action: this.options.onStartGame },
            { text: 'HIGH SCORE', action: this.options.onShowHighScore || (() => {}) },
            { text: 'CREDITS', action: this.options.onShowCredits || (() => {}) },
            { text: 'EXIT', action: this.options.onExit || (() => {}) }
        ]
        const screenCenter = new Vector(this.engine.screen.resolution.width / 2, this.engine.screen.resolution.height / 2)
        buttonConfigs.forEach((config, index) => {
            const button = new MenuButton(
                config.text, new Vector(screenCenter.x, screenCenter.y + 50 + index * 60),
                config.action
            )
            this.buttons.push(button)
            this.scene.add(button.actor)
        })
    }

    public show(): void {
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
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

    constructor(
        private text: string,
        position: Vector,
        private action: () => void
    ) {
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
            color: new Color(0, 50, 100, 40),
            strokeColor: new Color(100, 150, 200),
            lineWidth: 2
        })

        this.textGraphic = new Text({
            text: this.text,
            color: new Color(180, 180, 180),
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
            this.textGraphic.color = new Color(220, 220, 220)
            this.backgroundRect.strokeColor = new Color(150, 200, 255)
        })

        this.actor.on('pointerleave', () => {
            this.textGraphic.color = new Color(180, 180, 180)
            this.backgroundRect.strokeColor = new Color(100, 150, 200)
        })
    }

    public activate(): void {
        this.action()
    }

    public dispose(): void {
        this.actor.kill()
    }
}