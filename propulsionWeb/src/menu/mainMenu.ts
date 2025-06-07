import { Scene, Vector, Color, Actor, Engine, ImageSource, Sprite } from 'excalibur'
import { MenuButton } from '@src/menu/ui/menuButton'
import { getImagePath } from '@src/utils/assetPaths'
import { StarField } from '@src/game/ui/starField'

const TITLE_IMAGE = new ImageSource(getImagePath('title.png'))

export interface MainMenuOptions {
    onStartGame: () => void
    onShowBriefing?: () => void
    onShowControls?: () => void
    onShowHighScore?: () => void
    onShowCredits?: () => void
}

export class MainMenu {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'main-menu'
    private starField?: StarField

    constructor(private engine: Engine, private options: MainMenuOptions) {
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 20)
        this.scene.camera.pos = new Vector(0, 0)
        this.createStarField()
        this.createTitleImage()
        this.createButtons()
    }

    private createStarField(): void {
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        new StarField(this.scene, 80, new Vector(-screenWidth, -screenHeight), new Vector(0, screenHeight))
    }

    private createTitleImage(): void {
        const screenWidth = this.engine.screen.resolution.width
        const screenHeight = this.engine.screen.resolution.height
        const imageActor = new Actor({ 
            pos: new Vector(screenWidth / 4, 0),
            anchor: Vector.Half,
            z: 1
        })
        TITLE_IMAGE.load().then(() => {
            imageActor.graphics.use(new Sprite({
                image: TITLE_IMAGE,
                destSize: { width: screenWidth / 2, height: screenHeight }
            }))
        })
        this.scene.add(imageActor)
    }

    private createButtons(): void {
        const configs = [
            { text: 'START MISSION', action: this.options.onStartGame },
            { text: 'BRIEFING', action: this.options.onShowBriefing || (() => {}) },
            { text: 'CONTROLS', action: this.options.onShowControls || (() => {}) },
            { text: 'HALL OF FAME', action: this.options.onShowHighScore || (() => {}) },
            { text: 'CREDITS', action: this.options.onShowCredits || (() => {}) }
        ]
        configs.forEach((config, index) => {
            const button = new MenuButton(config.text, new Vector(-280, -135 + index * 70), config.action)
            this.buttons.push(button)
            this.scene.add(button.actor)
            this.scene.add(button)
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
        this.starField?.dispose()
        this.scene.clear()
        this.engine.remove(this.sceneName)
    }
}