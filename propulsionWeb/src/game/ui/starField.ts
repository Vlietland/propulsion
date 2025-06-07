import { Actor, Color, Scene, Timer, Vector, Engine } from 'excalibur'

interface Star {
    actor: Actor
    blinkTimer: Timer
    baseOpacity: number
    blinkSpeed: number
}

export class StarField {
    private stars: Star[] = []
    private scene?: Scene
    private starCount: number
    private minBlinkSpeed = 500
    private maxBlinkSpeed = 3000

    constructor(starCount: number) {
        this.starCount = starCount
    }

    public addToGameScene(scene: Scene, engine: Engine, map?: any): void {
        this.scene = scene
        if (!map) return
        const worldWidth = map.map.width * map.map.tilewidth
        const airTiles = map?.map?.properties?.find((p: any) => p.name === 'airHeight')?.value
        const worldHeight = airTiles * map.map.tileheight
        this.generateStars(worldWidth, worldHeight)
    }

    public generateStars(worldWidth: number, worldHeight: number): void {
        if (!this.scene) return
        
        for (let i = 0; i < this.starCount; i++) {
            const star = new Actor({
                pos: new Vector(
                    Math.random() * worldWidth,
                    Math.random() * worldHeight
                ),
                width: Math.random() > 0.8 ? 4 : 2,
                height: Math.random() > 0.8 ? 4 : 2,
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

    public updateScreenSize(engine: Engine): void {
        this.dispose()
        if (this.scene) this.addToGameScene(this.scene, engine)
    }
}
