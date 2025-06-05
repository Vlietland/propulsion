import { Scene, Vector, Color, Actor, Engine, Text, Font, FontUnit, Keys, KeyEvent } from 'excalibur'
import { MenuButton } from '@src/menu/menuButton'

export interface GameOverScreenOptions {
    onRestart: () => void
    onMainMenu?: () => void
    onNameSubmit?: (name: string) => void
}

export class GameOverScreen {
    private scene: Scene
    private buttons: MenuButton[] = []
    private sceneName = 'game-over-screen'
    private static instance: GameOverScreen | null = null
    private isHighScore = false
    private nameEntryMode = false
    private currentName = ''
    private keyboardListener?: (evt: KeyEvent) => void

    constructor(private engine: Engine, private score: number, isHighScore: boolean, private options: GameOverScreenOptions) {
        this.isHighScore = isHighScore
        this.scene = new Scene()
        this.scene.backgroundColor = new Color(5, 5, 15)
        this.scene.camera.pos = new Vector(0, 0)
        this.createGameOverElements()
        if (this.isHighScore) this.startNameEntry()
        else this.createButtons()
    }

    private createGameOverElements(): void {
        const titleActor = new Actor({ pos: new Vector(0, -150), anchor: Vector.Half })
        titleActor.graphics.use(new Text({
            text: this.isHighScore ? 'NEW HIGH SCORE!' : 'MISSION FAILED',
            color: this.isHighScore ? new Color(100, 255, 100) : new Color(255, 100, 100),
            font: new Font({ family: 'monospace', size: 48, unit: FontUnit.Px })
        }))
        this.scene.add(titleActor)

        const scoreActor = new Actor({ pos: new Vector(0, -80), anchor: Vector.Half })
        scoreActor.graphics.use(new Text({
            text: `FINAL SCORE: ${this.score}`,
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
        }))
        this.scene.add(scoreActor)
    }

    private startNameEntry(): void {
        this.nameEntryMode = true
        this.currentName = ''
        this.createNameEntryElements()
        this.setupNameEntryInput()
    }

    private createNameEntryElements(): void {
        const promptActor = new Actor({ pos: new Vector(0, 20), anchor: Vector.Half })
        promptActor.graphics.use(new Text({
            text: 'ENTER COMMANDER NAME:',
            color: new Color(255, 255, 100),
            font: new Font({ family: 'monospace', size: 20, unit: FontUnit.Px })
        }))
        promptActor.name = 'namePrompt'
        this.scene.add(promptActor)

        const nameDisplayActor = new Actor({ pos: new Vector(0, 70), anchor: Vector.Half })
        nameDisplayActor.graphics.use(new Text({
            text: this.currentName + '_',
            color: new Color(255, 255, 255),
            font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
        }))
        nameDisplayActor.name = 'nameDisplay'
        this.scene.add(nameDisplayActor)

        const instructionActor = new Actor({ pos: new Vector(0, 120), anchor: Vector.Half })
        instructionActor.graphics.use(new Text({
            text: 'Press ENTER to confirm, ESC to skip',
            color: new Color(200, 200, 200),
            font: new Font({ family: 'monospace', size: 14, unit: FontUnit.Px })
        }))
        instructionActor.name = 'nameInstruction'
        this.scene.add(instructionActor)
    }

    private updateNameDisplay(): void {
        const nameDisplayActor = this.scene.actors.find(a => a.name === 'nameDisplay')
        if (nameDisplayActor) {
            nameDisplayActor.graphics.use(new Text({
                text: this.currentName + '_',
                color: new Color(255, 255, 255),
                font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
            }))
        }
    }

    private setupNameEntryInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (!this.nameEntryMode) return

            if (evt.key === Keys.Enter) this.submitName()
            else if (evt.key === Keys.Escape) this.skipNameEntry()
            else if (evt.key === Keys.Backspace) {
                if (this.currentName.length > 0) {
                    this.currentName = this.currentName.slice(0, -1)
                    this.updateNameDisplay()
                }
            } else if (this.currentName.length < 12) {
                let char = ''
                
                if (evt.key.startsWith('Key') && evt.key.length === 4) {
                    char = evt.key.charAt(3).toUpperCase()
                }
                else if (evt.key.startsWith('Digit') && evt.key.length === 6) {
                    char = evt.key.charAt(5)
                }
                else if (evt.key === Keys.Space) {
                    char = ' '
                }
                else if (evt.key === Keys.Period) {
                    char = '.'
                }
                else if (evt.key === Keys.Minus) {
                    char = '-'
                }
                
                if (char && /[A-Z0-9\s\.\-]/.test(char)) {
                    this.currentName += char
                    this.updateNameDisplay()
                }
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
    }

    private submitName(): void {
        if (this.options.onNameSubmit) {
            const finalName = this.currentName.trim() || 'COMMANDER'
            this.options.onNameSubmit(finalName)
        }
        this.finishNameEntry()
    }

    private skipNameEntry(): void {
        if (this.options.onNameSubmit) this.options.onNameSubmit('ANONYMOUS')
        this.finishNameEntry()
    }

    private finishNameEntry(): void {
        this.nameEntryMode = false
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
        
        this.scene.actors
            .filter(a => ['namePrompt', 'nameDisplay', 'nameInstruction'].includes(a.name || ''))
            .forEach(a => a.kill())
        
        this.createButtons()
    }

    private createButtons(): void {
        const configs = [
            { text: 'RESTART MISSION', action: this.options.onRestart },
            ...(this.options.onMainMenu ? [{ text: 'MAIN MENU', action: this.options.onMainMenu }] : [])
        ]
        configs.forEach((config, index) => {
            const button = new MenuButton(config.text, new Vector(0, 50 + index * 70), config.action)
            this.buttons.push(button)
            this.scene.add(button.actor)
            this.scene.add(button)
        })
    }

    public show(): void {
        this.buttons.forEach(button => button.show())
        this.engine.add(this.sceneName, this.scene)
        this.engine.goToScene(this.sceneName)
        
        if (this.nameEntryMode && !this.keyboardListener) {
            setTimeout(() => {
                this.setupNameEntryInput()
            }, 100)
        }
    }

    public hide(): void {
        this.buttons.forEach(button => button.hide())
    }

    public dispose(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
        this.buttons.forEach(button => button.dispose())
        this.scene.clear()
        this.engine.remove(this.sceneName)
        GameOverScreen.instance = null
    }

    static show(score: number, isHighScore: boolean, onRestart: () => void, onMainMenu?: () => void, onNameSubmit?: (name: string) => void, engine?: Engine) {
        if (!engine) return
        if (GameOverScreen.instance) GameOverScreen.instance.dispose()
        GameOverScreen.instance = new GameOverScreen(engine, score, isHighScore, {
            onRestart, onMainMenu, onNameSubmit
        })
        GameOverScreen.instance.show()
    }

    static hideCurrentInstance(): void {
        if (GameOverScreen.instance) GameOverScreen.instance.hide()
    }

    static disposeCurrentInstance(): void {
        if (GameOverScreen.instance) GameOverScreen.instance.dispose()
    }
}