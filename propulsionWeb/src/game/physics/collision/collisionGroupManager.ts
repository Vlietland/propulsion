import { CollisionGroup } from 'excalibur'

export class CollisionGroupManager {
    private _collisionGroups: Map<string, CollisionGroup>

    constructor() {
        this._collisionGroups = new Map<string, CollisionGroup>()
        this.initializeDefaultCollisionGroups()
    }

    private initializeDefaultCollisionGroups(): void {
        const shipGroup = new CollisionGroup('Ship', 0x0001, 0xFFFF)
        const ballGroup = new CollisionGroup('Ball', 0x0002, 0xFFFF)
        const wallGroup = new CollisionGroup('Wall', 0x0004, 0xFFFF)
        const reactorGroup = new CollisionGroup('Reactor', 0x0008, 0xFFFF)
        const transformerGroup = new CollisionGroup('Transformer', 0x0010, 0xFFFF)
        const laserBeamGroup = new CollisionGroup('LaserBeam', 0x0020, 0xFFFF)
        const shipBulletGroup = new CollisionGroup('ShipBullet', 0x0040, 0xFFFF)
        const turretBulletGroup = new CollisionGroup('TurretBullet', 0x0080, 0xFFFF)
        
        this._collisionGroups.set('Ship', shipGroup)
        this._collisionGroups.set('Ball', ballGroup)
        this._collisionGroups.set('Wall', wallGroup)
        this._collisionGroups.set('Reactor', reactorGroup)
        this._collisionGroups.set('Transformer', transformerGroup)
        this._collisionGroups.set('LaserBeam', laserBeamGroup)
        this._collisionGroups.set('ShipBullet', shipBulletGroup)
        this._collisionGroups.set('TurretBullet', turretBulletGroup)
    }

    public getCollisionGroup(name: string): CollisionGroup | undefined {
        return this._collisionGroups.get(name)
    }

    public configureCollisionRelationships(): void {
        // Configure which groups should collide with each other
        // Ship collides with Wall, Reactor, Transformer, LaserBeam, TurretBullet
        this.configureGroupPair('Ship', ['Wall', 'Reactor', 'Transformer', 'LaserBeam', 'TurretBullet'])
        
        // Ball collides with Wall, Reactor, Transformer
        this.configureGroupPair('Ball', ['Wall', 'Reactor', 'Transformer', 'ShipBullet', 'TurretBullet'])
        
        // ShipBullet collides with Wall, Reactor, Transformer, Turret
        this.configureGroupPair('ShipBullet', ['Wall', 'Reactor', 'Transformer'])
        
        // TurretBullet collides with Wall, Ship, Ball
        this.configureGroupPair('TurretBullet', ['Wall', 'Ship', 'Ball'])
        
        // LaserBeam collides with Ship
        this.configureGroupPair('LaserBeam', ['Ship'])
    }
    
    private configureGroupPair(groupName: string, collidesWithNames: string[]): void {
        const group = this.getCollisionGroup(groupName)
        if (!group) return
        
        for (const otherName of collidesWithNames) {
            const otherGroup = this.getCollisionGroup(otherName)
            if (otherGroup) {
                // In Excalibur, collision groups are already configured in constructor
                // This method exists for future extension
            }
        }
    }
}
