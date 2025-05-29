import { Engine } from 'excalibur'
import { CollisionDetector } from './collisionDetector'
import { CollisionRegistry } from './collisionRegistry'

export class CollisionResponseHandler {
    private _engine: Engine | null = null
    private _detector: CollisionDetector
    private _registry: CollisionRegistry

    constructor(detector: CollisionDetector, registry: CollisionRegistry) {
        this._detector = detector
        this._registry = registry
    }
    
    public initialize(engine: Engine): void {
        this._engine = engine
    }

    public update(delta: number): void {
        if (!this._engine) return
        
        // Process specific collision logic beyond what Excalibur's built-in
        // physics system already handles. For example, special game rules
        // for when certain types of objects collide
        
        // Handle ship collisions
        this.processShipCollisions()
        
        // Handle ball collisions
        this.processBallCollisions()
        
        // Handle bullet collisions
        this.processBulletCollisions()
        
        // Handle laser beam collisions
        this.processLaserBeamCollisions()
    }
    
    private processShipCollisions(): void {
        const ships = this._registry.getActorsByGroup('Ship')
        
        for (const ship of ships) {
            const collisions = this._detector.findCollisionsWithActor(ship)
            
            if (collisions.length > 0) {
                // Ship has collided with something
                // For now, just log it for debugging
                console.log(`Ship has collided with ${collisions.length} objects`)
                
                // Handle specific collision responses here
                // Example: Ship explodes on contact with any non-zero ID tile/object
            }
        }
    }
    
    private processBallCollisions(): void {
        const balls = this._registry.getActorsByGroup('Ball')
        
        for (const ball of balls) {
            const collisions = this._detector.findCollisionsWithActor(ball)
            
            for (const other of collisions) {
                // Handle specific collision responses here
                // Example: Ball explodes on contact with any non-zero ID tile/object
            }
        }
    }
    
    private processBulletCollisions(): void {
        // Process ShipBullet collisions
        const shipBullets = this._registry.getActorsByGroup('ShipBullet')
        
        for (const bullet of shipBullets) {
            const collisions = this._detector.findCollisionsWithActor(bullet)
            
            for (const other of collisions) {
                // Handle specific collision responses here
                // Example: Destroy on contact with any non-zero ID tile/object
            }
        }
        
        // Process TurretBullet collisions
        const turretBullets = this._registry.getActorsByGroup('TurretBullet')
        
        for (const bullet of turretBullets) {
            const collisions = this._detector.findCollisionsWithActor(bullet)
            
            for (const other of collisions) {
                // Handle specific collision responses here
                // Example: Destroy on contact with any non-zero ID tile/object
            }
        }
    }
    
    private processLaserBeamCollisions(): void {
        const laserBeams = this._registry.getActorsByGroup('LaserBeam')
        
        for (const beam of laserBeams) {
            const collisions = this._detector.findCollisionsWithActor(beam, ['Ship'])
            
            for (const other of collisions) {
                // Handle specific collision responses here
                // Example: Damage ship when in contact with laser beam
            }
        }
    }
}
