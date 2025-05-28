import { Actor, CollisionGroup, CollisionType, Engine, Ray, Scene, Shape, TileMap, Vector } from 'excalibur'

export class CollisionManager {
    private static _instance: CollisionManager

    private _collisionGroups: Map<string, CollisionGroup>
    private _actors: Map<string, Actor>
    private _engine: Engine | null = null
    private _wallColliders: Shape[] = []

    public static get instance(): CollisionManager {
        if (!CollisionManager._instance) {
            CollisionManager._instance = new CollisionManager()
        }
        return CollisionManager._instance
    }

    private constructor() {
        this._collisionGroups = new Map<string, CollisionGroup>()
        this._actors = new Map<string, Actor>()
        this.initializeDefaultCollisionGroups()
    }

    public initialize(engine: Engine): void {
        this._engine = engine
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

    public registerActor(actor: Actor, groupName: string): void {
        const group = this._collisionGroups.get(groupName)
        if (group && actor.id) {
            actor.body.collisionType = CollisionType.Active
            actor.body.group = group
            this._actors.set(actor.id.toString(), actor)
        }
    }

    public unregisterActor(actor: Actor): void {
        if (actor.id) {
            this._actors.delete(actor.id.toString())
        }
    }

    public getRegisteredActor(id: string): Actor | undefined {
        return this._actors.get(id)
    }

    public getActorsByGroup(groupName: string): Actor[] {
        const group = this._collisionGroups.get(groupName)
        if (!group) return []

        return Array.from(this._actors.values()).filter(actor => 
            actor.body.group === group
        )
    }

    public isColliding(actorA: Actor, actorB: Actor): boolean {
        return actorA.collider.collide(actorB.collider).length > 0
    }

    public findCollisionsWithActor(actor: Actor, groupNames?: string[]): Actor[] {
        const collisions: Actor[] = []
        
        // Filter by collision groups if specified
        let actorsToCheck = Array.from(this._actors.values())
        if (groupNames && groupNames.length > 0) {
            const groups = groupNames
                .map(name => this.getCollisionGroup(name))
                .filter(Boolean) as CollisionGroup[]
                
            actorsToCheck = actorsToCheck.filter(otherActor => 
                otherActor !== actor && 
                otherActor.body.group && 
                groups.includes(otherActor.body.group)
            )
        } else {
            actorsToCheck = actorsToCheck.filter(otherActor => otherActor !== actor)
        }
        
        for (const otherActor of actorsToCheck) {
            if (this.isColliding(actor, otherActor)) {
                collisions.push(otherActor)
            }
        }
        
        return collisions
    }

    public processTileMap(tileMap: TileMap): void {
        // Will be implemented in step 3.1
    }

    public raycast(origin: Vector, direction: Vector, maxDistance: number, collisionGroups?: CollisionGroup[]): any[] {
        if (!this._engine) return []

        const ray = new Ray(origin, direction.normalize())
        const scene = this._engine.currentScene
        
        // Excalibur's physics system provides the rayCast method
        const hits = scene.physics.rayCast(ray, { maxDistance })
        
        // Filter by collision groups if specified
        if (collisionGroups && collisionGroups.length > 0) {
            return hits.filter((hit: any) => 
                hit.actor && hit.actor.body && 
                collisionGroups.some(group => hit.actor.body.group === group)
            )
        }
        
        return hits
    }

    public update(delta: number): void {
        // Will be implemented in a future step
    }

    public reset(): void {
        this._actors.clear()
        this._wallColliders = []
    }

    public toggleDebug(enabled: boolean): void {
        if (!this._engine) return
        
        if (this._engine.debug && this._engine.debug.physics) {
            this._engine.debug.physics.showAll = enabled
            this._engine.debug.physics.showCollisionNormals = enabled
            this._engine.debug.physics.showCollisionContacts = enabled
        }
    }
}