import { Engine, Shape, CollisionType } from 'excalibur'
import { CollisionRegistry } from './collisionRegistry'
import { CollisionGroupManager } from './collisionGroupManager'

export class CollisionDebugger {
    private _engine: Engine | null = null
    private _registry: CollisionRegistry
    private _groupManager: CollisionGroupManager
    private _wallColliders: Shape[] = []

    constructor(registry: CollisionRegistry, groupManager: CollisionGroupManager) {
        this._registry = registry
        this._groupManager = groupManager
    }
    
    public initialize(engine: Engine): void {
        this._engine = engine
    }
    
    public setWallColliders(wallColliders: Shape[]): void {
        this._wallColliders = wallColliders
    }

    public enableDebugDrawing(): void {
        this.toggleDebug(true)
    }
    
    public disableDebugDrawing(): void {
        this.toggleDebug(false)
    }
    
    private toggleDebug(enabled: boolean): void {
        if (!this._engine) return
        
        if (this._engine.debug && this._engine.debug.physics) {
            this._engine.debug.physics.showAll = enabled
            this._engine.debug.physics.showCollisionNormals = enabled
            this._engine.debug.physics.showCollisionContacts = enabled
        }
    }
    
    public getCollisionStats(): { actorCount: number, wallColliderCount: number, activeGroups: string[] } {
        // Get all group names that have at least one actor
        const activeGroups: Set<string> = new Set()
        
        for (const actor of this._registry.getAllActors()) {
            if (actor.body.group) {
                activeGroups.add(actor.body.group.name)
            }
        }
        
        return {
            actorCount: this._registry.count(),
            wallColliderCount: this._wallColliders.length,
            activeGroups: Array.from(activeGroups)
        }
    }
    
    public toggleCollisionGroup(name: string, enabled: boolean): void {
        const group = this._groupManager.getCollisionGroup(name)
        if (!group) return
        
        // In Excalibur, we can't easily disable a collision group, so we'll
        // instead toggle the collision type of all actors in that group
        const actorsInGroup = this._registry.getActorsByGroup(name)
        
        for (const actor of actorsInGroup) {
            actor.body.collisionType = enabled ? 
                CollisionType.Active : 
                CollisionType.PreventCollision
        }
    }
}
