import { Scene, Actor, Vector, Color, Text, Font, FontUnit, Keys, KeyEvent, Engine } from 'excalibur'

export class NameEntry {
    private currentName = ''
    private keyboardListener?: (evt: KeyEvent) => void
    private actors: Actor[] = []

    constructor(private scene: Scene, private engine: Engine, private onSubmit: (name: string) => void) {
        this.setup()
    }

    private setup(): void {
        this.actors = [
            this.createTextActor('ENTER COMMANDER NAME:', new Vector(0, 20), new Color(255, 255, 100), 20),
            this.createTextActor('_', new Vector(0, 70), new Color(255, 255, 255), 24, 'nameDisplay'),
            this.createTextActor('Press ENTER to confirm, ESC to skip', new Vector(0, 120), new Color(200, 200, 200), 14)
        ]
        this.actors.forEach(actor => this.scene.add(actor))
        this.setupInput()
    }

    private createTextActor(text: string, pos: Vector, color: Color, size: number, name?: string): Actor {
        const actor = new Actor({ pos, anchor: Vector.Half })
        actor.graphics.use(new Text({ text, color, font: new Font({ family: 'monospace', size, unit: FontUnit.Px }) }))
        if (name) actor.name = name
        return actor
    }

    private setupInput(): void {
        this.keyboardListener = (evt: KeyEvent) => {
            if (evt.key === Keys.Enter) this.submit()
            else if (evt.key === Keys.Escape) this.skip()
            else if (evt.key === Keys.Backspace && this.currentName.length > 0) {
                this.currentName = this.currentName.slice(0, -1)
                this.updateDisplay()
            } else if (this.currentName.length < 12) {
                const char = this.parseKey(evt.key)
                if (char) {
                    this.currentName += char
                    this.updateDisplay()
                }
            }
        }
        this.engine.input.keyboard.on('press', this.keyboardListener)
    }

    private parseKey(key: string): string {
        if (key.startsWith('Key') && key.length === 4) return key.charAt(3).toUpperCase()
        if (key.startsWith('Digit') && key.length === 6) return key.charAt(5)
        if (key === Keys.Space) return ' '
        if (key === Keys.Period) return '.'
        if (key === Keys.Minus) return '-'
        return ''
    }

    private updateDisplay(): void {
        const display = this.scene.actors.find(a => a.name === 'nameDisplay')
        if (display) {
            display.graphics.use(new Text({
                text: this.currentName + '_',
                color: new Color(255, 255, 255),
                font: new Font({ family: 'monospace', size: 24, unit: FontUnit.Px })
            }))
        }
    }

    private submit(): void {
        this.onSubmit(this.currentName.trim() || 'COMMANDER')
        this.cleanup()
    }

    private skip(): void {
        this.onSubmit('ANONYMOUS')
        this.cleanup()
    }

    private cleanup(): void {
        if (this.keyboardListener) {
            this.engine.input.keyboard.off('press', this.keyboardListener)
            this.keyboardListener = undefined
        }
        this.actors.forEach(actor => actor.kill())
        this.actors = []
    }
}
