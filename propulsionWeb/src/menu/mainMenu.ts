import { Scene, Vector, Color, Actor, Engine, ImageSource, Sprite } from 'excalibur'
import { MenuButton } from '@src/menu/menuButton'

const TITLE_IMAGE = new ImageSource('./images/title.png')

export interface MainMenuOptions {
    onStartGame: () => void
    onShowBriefing?: () => void
    onShowHighScore?: () => void
    onShowCredits?: () => void
    onExit?: () => void
}

export class MainMenu {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'main-menu'

    constructor(private engine: Engine, private options: MainMenuOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 20)
        this.scene.camera.pos = new Vector(0, 0)
        this.createTitleImage()
        this.createButtons()
    }

    private createTitleImage(): void {
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        const imageActor = new Actor({ 
            pos: new Vector(screenWidth / 4, 0), // Position to the right half of screen
            anchor: Vector.Half,
            z: 1
        })
        TITLE_IMAGE.load().then(() => {
            imageActor.graphics.use(new Sprite({
                image: TITLE_IMAGE,
                destSize: { width: screenWidth / 2, height: screenHeight } // Full right side
            }))
        })
        this.scene.add(imageActor)
    }

    private createButtons(): void {
        const configs = [
            { text: 'START GAME', action: this.options.onStartGame },
            { text: 'BRIEFING', action: this.options.onShowBriefing || (() => {}) },
            { text: 'HIGH SCORE', action: this.options.onShowHighScore || (() => {}) },
            { text: 'CREDITS', action: this.options.onShowCredits || (() => {}) },
            { text: 'EXIT', action: this.options.onExit || (() => {}) }
        ]
        configs.forEach((config, index) => {
            const button = new MenuButton(config.text, new Vector(-280, -135 + index * 70), config.action)
            this.buttons.push(button)
            this.scene.add(button.actor)
            this.scene.add(button) // Add the ScreenElement to the scene
        })
    }

    public show(): void {
        this.buttons.forEach(button => button.show())
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
    }

    public hide(): void {
        this.buttons.forEach(button => button.hide())        
    }

    public dispose(): void {
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}