import { Scene, Vector, Color, Circle, Actor } from 'excalibur'

export class ChimneySmoke {
    static spawn(scene: Scene | null, pos: Vector, direction: number = -Math.PI / 2) {
        const spread = Math.PI * 0.3
        const minSpeed = 10
        const maxSpeed = 40
        const particleCount = 3

        for (let i = 0; i < particleCount; i++) {
            const angle = direction + (Math.random() - 0.5) * spread
            const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
            const velocity = Vector.fromAngle(angle).scale(speed / 60)
            
            const greyness = 0.7 + Math.random() * 0.3
            const color = new Color(
                Math.floor(greyness * 255),
                Math.floor(greyness * 255), 
                Math.floor(greyness * 255),
                0.6 + Math.random() * 0.4
            )

            let radius = 3 + Math.random() * 6
            const circle = new Circle({ radius, color })
            const particle = new Actor({
                pos: pos.clone().add(Vector.fromAngle(angle).scale(Math.random() * 8)),
                anchor: Vector.Half
            })

            particle.graphics.use(circle)
            particle.graphics.opacity = 0.4 + Math.random() * 0.3
            let life = 60 + Math.floor(Math.random() * 90)
            const rotSpeed = (Math.random() - 0.5) * 0.05
            const drift = Vector.fromAngle(Math.random() * Math.PI * 2).scale(0.2)

            particle.on('preupdate', () => {
                particle.pos = particle.pos.add(velocity).add(drift)
                radius *= 1.008 + Math.random() * 0.004
                circle.radius = radius
                particle.graphics.opacity *= 0.988 + Math.random() * 0.008
                particle.rotation += rotSpeed
                velocity.x *= 0.995
                velocity.y *= 0.995
                
                life--
                if (life <= 0 || particle.graphics.opacity < 0.01) {
                    particle.kill()
                }
            })

            scene?.add(particle)
        }
    }

    static spawnContinuous(scene: Scene | null, pos: Vector, direction: number = -Math.PI / 2, interval: number = 300) {
        const smokeTimer = setInterval(() => {
            if (scene) {
                ChimneySmoke.spawn(scene, pos, direction)
            }
        }, interval)

        return smokeTimer
    }

    static stopContinuous(timerId: NodeJS.Timeout) {
        clearInterval(timerId)
    }
}
