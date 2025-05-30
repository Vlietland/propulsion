import { Scene, Vector, Color, Circle, Actor } from 'excalibur';

export class Explosion {
    static spawn(scene: Scene | null, pos: Vector, direction: number) {
        const spread = Math.PI *2;
        const minSpeed = 0;
        const maxSpeed = 250;
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = direction + (Math.random() - 0.5) * spread * (0.7 + Math.random() * 1.5);
            const speed = minSpeed + Math.random() * (maxSpeed - minSpeed) * (0.7 + Math.random() * 1.5);
            const velocity = Vector.fromAngle(angle).scale(speed / 60);
            const t = Math.random();
            const colorStops = [Color.Yellow, new Color(255, 140, 0), Color.Red];
            let color: Color;
            if (t > 0.85) color = Color.Red;
            else if (t > 0.6) color = lerpColor(Color.Yellow, Color.Orange, (t-0.6)/0.4);
            else if (t > 0.3) color = lerpColor(Color.Yellow, new Color(255, 140, 0), (t-0.3)/0.3);
            else color = lerpColor(new Color(255, 140, 0), Color.Red, t/0.3);

            let radius = 40 + Math.random() * 60 + (t > 0.8 ? Math.random() * 40 : 0);
            const circle = new Circle({ radius, color });
            const particle = new Actor({
                pos: pos.clone().add(Vector.fromAngle(direction + (Math.random() - 0.5) * spread * 1.5).scale(Math.random() * 32)), // larger offset
                anchor: Vector.Half
            });
            particle.graphics.use(circle);
            particle.graphics.opacity = 0.8 + Math.random() * 0.2;
            let life = 22 + Math.floor(Math.random() * 22) + (t > 0.8 ? 12 : 0); // some last longer
            const hasTrail = Math.random() > 0.7;
            const rotSpeed = (Math.random() - 0.5) * 0.2;
            particle.rotation = direction + (Math.random() - 0.5) * 0.5;
            particle.on('preupdate', () => {
                particle.pos = particle.pos.add(velocity);
                radius *= 0.91 + Math.random() * 0.03;
                circle.radius = radius;
                particle.graphics.opacity *= 0.94 + Math.random() * 0.03;
                particle.rotation += rotSpeed;
                if (hasTrail && Math.random() > 0.7 && scene) {
                    const trail = new Actor({
                        pos: particle.pos.clone(),
                        anchor: Vector.Half
                    });
                    const trailCircle = new Circle({ radius: 6 + Math.random() * 4, color: color.darken(0.3) });
                    trail.graphics.use(trailCircle);
                    trail.graphics.opacity = 0.3 + Math.random() * 0.2;
                    let trailLife = 8 + Math.floor(Math.random() * 6);
                    trail.on('preupdate', () => {
                        trail.graphics.opacity *= 0.7;
                        trailLife--;
                        if (trailLife <= 0) trail.kill();
                    });
                    scene.add(trail);
                }
                life--;
                if (life <= 0) particle.kill();
            });
            scene?.add(particle);
        }

        function lerpColor(a: Color, b: Color, t: number): Color {
            return new Color(
                a.r + (b.r - a.r) * t,
                a.g + (b.g - a.g) * t,
                a.b + (b.b - a.b) * t,
                a.a + (b.a - a.a) * t
            );
        }
    }
}