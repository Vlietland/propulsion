import { Scene, Vector, Color, Circle, Actor, Line } from 'excalibur'

export class HyperspaceView {
    static spawn(scene: Scene | null, pos: Vector, direction: number) {
        if (!scene) return
        
        HyperspaceView.spawnHyperspaceRings(scene, pos)
        HyperspaceView.spawnLightStreaks(scene, pos, direction)
        HyperspaceView.spawnParticles(scene, pos, direction)
    }

    private static spawnHyperspaceRings(scene: Scene, pos: Vector) {
        const ringCount = 5
        const colors = [
            Color.Blue,
            Color.White,
            new Color(100, 200, 255),
            new Color(50, 100, 255),
            Color.White
        ]
        
        for (let i = 0; i < ringCount; i++) {
            const delay = i * 120
            
            setTimeout(() => {
                let radius = 10
                const ring = new Actor({
                    pos: pos.clone(),
                    anchor: Vector.Half
                })
                
                const circle = new Circle({
                    radius: radius,
                    color: colors[i % colors.length],
                    strokeColor: Color.White,
                    lineWidth: 2,
                    fill: false
                })
                
                ring.graphics.use(circle)
                ring.graphics.opacity = 0.9
                
                let life = 60
                const growthRate = 8 + i * 2
                
                ring.on('preupdate', () => {
                    radius += growthRate
                    circle.radius = radius
                    
                    ring.graphics.opacity *= 0.96
                    
                    life--
                    if (life <= 0) ring.kill()
                })
                
                scene.add(ring)
            }, delay)
        }
    }

    private static spawnLightStreaks(scene: Scene, pos: Vector, direction: number) {
        const streakCount = 30
        const baseLength = 200
        const spread = Math.PI * 0.4
        
        for (let i = 0; i < streakCount; i++) {
            const angle = direction + (Math.random() - 0.5) * spread
            const length = baseLength + Math.random() * 500
            
            const streak = new Actor({
                pos: pos.clone(),
                anchor: Vector.Half
            })
            
            const t = Math.random()
            const color = HyperspaceView.lerpColor(
                Color.White,
                new Color(100, 170, 255),
                t
            )
            
            let currentLength = length
            const thickness = 1 + Math.random() * 3
            let endPoint = Vector.fromAngle(angle).scale(currentLength)
            
            const line = new Line({
                start: Vector.Zero,
                end: endPoint,
                color: color,
                thickness: thickness
            })
            
            streak.graphics.use(line)
            streak.graphics.opacity = 0.7 + Math.random() * 0.3
            
            let life = 20 + Math.floor(Math.random() * 40)
            
            streak.on('preupdate', () => {
                currentLength *= 1.1
                const newEndPoint = Vector.fromAngle(angle).scale(currentLength)
                
                const newLine = new Line({
                    start: Vector.Zero,
                    end: newEndPoint,
                    color: color,
                    thickness: thickness
                })
                
                streak.graphics.use(newLine)
                streak.graphics.opacity *= 0.95
                
                life--
                if (life <= 0) streak.kill()
            })
            
            scene.add(streak)
        }
    }

    private static spawnParticles(scene: Scene, pos: Vector, direction: number) {
        const spread = Math.PI * 2
        const minSpeed = 50
        const maxSpeed = 400
        const particleCount = 25

        for (let i = 0; i < particleCount; i++) {
            const angle = direction + (Math.random() - 0.5) * spread
            const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
            const velocity = Vector.fromAngle(angle).scale(speed / 60)
            
            const t = Math.random()
            let color: Color
            
            if (t > 0.7) color = Color.White
            else if (t > 0.4) color = HyperspaceView.lerpColor(new Color(100, 170, 255), Color.White, (t - 0.4) / 0.3)
            else color = HyperspaceView.lerpColor(Color.Blue, new Color(100, 170, 255), t / 0.4)

            let radius = 20 + Math.random() * 50 + (t > 0.8 ? Math.random() * 30 : 0)
            
            const circle = new Circle({ radius, color })
            const particle = new Actor({
                pos: pos.clone().add(Vector.fromAngle(direction + (Math.random() - 0.5) * spread).scale(Math.random() * 20)),
                anchor: Vector.Half
            })
            
            particle.graphics.use(circle)
            particle.graphics.opacity = 0.8 + Math.random() * 0.2
            
            let life = 25 + Math.floor(Math.random() * 30) + (t > 0.8 ? 15 : 0)
            const hasTrail = Math.random() > 0.5
            const rotSpeed = (Math.random() - 0.5) * 0.2
            
            particle.rotation = direction + (Math.random() - 0.5) * 0.5
            
            particle.on('preupdate', () => {
                particle.pos = particle.pos.add(velocity)
                
                radius *= 0.93 + Math.random() * 0.02
                circle.radius = radius
                
                particle.graphics.opacity *= 0.95 + Math.random() * 0.02
                particle.rotation += rotSpeed
                
                if (hasTrail && Math.random() > 0.7) {
                    const trail = new Actor({
                        pos: particle.pos.clone(),
                        anchor: Vector.Half
                    })
                    
                    const trailCircle = new Circle({ 
                        radius: 3 + Math.random() * 8, 
                        color: color.lighten(0.3) 
                    })
                    
                    trail.graphics.use(trailCircle)
                    trail.graphics.opacity = 0.4 + Math.random() * 0.3
                    
                    let trailLife = 10 + Math.floor(Math.random() * 8)
                    
                    trail.on('preupdate', () => {
                        trail.graphics.opacity *= 0.75
                        trailLife--
                        if (trailLife <= 0) trail.kill()
                    })
                    
                    scene.add(trail)
                }
                
                life--
                if (life <= 0) particle.kill()
            })
            
            scene.add(particle)
        }
    }

    static lerpColor(a: Color, b: Color, t: number): Color {
        return new Color(
            a.r + (b.r - a.r) * t,
            a.g + (b.g - a.g) * t,
            a.b + (b.b - a.b) * t,
            a.a + (b.a - a.a) * t
        )
    }
}