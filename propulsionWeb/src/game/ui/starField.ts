import { Actor, Color, Scene, Timer, Vector } from 'excalibur'

const STAR_MIN_SIZE = 2
const STAR_MAX_SIZE = 3

interface Star {
    actor: Actor
    blinkTimer: Timer
    baseOpacity: number
    blinkSpeed: number
}

export class StarField {
    private stars: Star[] = []
    private scene?: Scene
    private minBlinkSpeed = 500
    private maxBlinkSpeed = 3000

    constructor(
        scene: Scene,
        starCount: number,
        startVector: Vector,
        endVector: Vector
    ) {
        this.scene = scene
        if (!this.scene) return
        
        const width = endVector.x - startVector.x
        const height = endVector.y - startVector.y
        
        for (let i = 0; i < starCount; i++) {
            const star = new Actor({
                pos: new Vector(
                    startVector.x + Math.random() * width,
                    startVector.y + Math.random() * height
                ),
                width: Math.random() > 0.8 ? STAR_MAX_SIZE : STAR_MIN_SIZE,
                height: Math.random() > 0.8 ? STAR_MAX_SIZE : STAR_MIN_SIZE,
                color: this.getStarColor(),
                z: -1
            })
            const baseOpacity = 0.3 + Math.random() * 0.7
            star.graphics.opacity = baseOpacity

            const blinkSpeed = this.minBlinkSpeed + Math.random() * (this.maxBlinkSpeed - this.minBlinkSpeed)
            const blinkTimer = new Timer({
                fcn: () => this.blinkStar(star, baseOpacity),
                interval: blinkSpeed,
                repeats: true
            })
            this.scene.add(star)
            this.scene.add(blinkTimer)
            blinkTimer.start()
            this.stars.push({ actor: star, blinkTimer, baseOpacity, blinkSpeed })
        }
    }

    private getStarColor(): Color {
        const colorType = Math.random()
        if (colorType < 0.7) return Color.White
        else if (colorType < 0.9) return new Color(255, 255, 220)
        else return new Color(220, 220, 255)
    }

    private blinkStar(star: Actor, baseOpacity: number): void {
        const currentOpacity = star.graphics.opacity
        if (currentOpacity <= 0.1) star.graphics.opacity = baseOpacity
        else star.graphics.opacity = 0.1 + Math.random() * 0.9
    }

    public dispose(): void {
        this.stars.forEach(star => {
            if (star.blinkTimer) {
                star.blinkTimer.cancel()
                if (this.scene) this.scene.remove(star.blinkTimer)
            }
            if (star.actor && this.scene) this.scene.remove(star.actor)
        })
        this.stars = []
        this.scene = undefined
    }
}
