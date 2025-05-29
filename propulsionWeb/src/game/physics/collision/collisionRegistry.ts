import { Actor, CollisionGroup, CollisionType, Scene } from 'excalibur'
import { CollisionGroupManager } from './collisionGroupManager'

export class CollisionRegistry {
    private _actors: Map<string, Actor>
    private _groupManager: CollisionGroupManager

    constructor(groupManager: CollisionGroupManager) {
        this._actors = new Map<string, Actor>()
        this._groupManager = groupManager
    }

    public registerActor(actor: Actor, groupName: string): void {
        const group = this._groupManager.getCollisionGroup(groupName)
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
        const group = this._groupManager.getCollisionGroup(groupName)
        if (!group) return []

        return Array.from(this._actors.values()).filter(actor => 
            actor.body.group === group
        )
    }
    
    public getAllActors(): Actor[] {
        return Array.from(this._actors.values())
    }
    
    public registerAllActors(scene: Scene): void {
        if (!scene) return
        
        // Register all actors in the scene with appropriate collision groups
        for (const actor of scene.actors) {
            // Skip actors that are already registered
            if (this._actors.has(actor.id.toString())) continue
            
            // Determine the collision group based on actor type or tags
            if (actor.tags.has('Ship')) {
                this.registerActor(actor, 'Ship')
            } else if (actor.tags.has('Ball')) {
                this.registerActor(actor, 'Ball')
            } else if (actor.tags.has('Reactor')) {
                this.registerActor(actor, 'Reactor')
            } else if (actor.tags.has('Transformer')) {
                this.registerActor(actor, 'Transformer')
            } else if (actor.tags.has('LaserBeam')) {
                this.registerActor(actor, 'LaserBeam')
            } else if (actor.tags.has('ShipBullet')) {
                this.registerActor(actor, 'ShipBullet')
            } else if (actor.tags.has('TurretBullet')) {
                this.registerActor(actor, 'TurretBullet')
            }
            // Wall actors are handled by the TileMapCollisionProcessor
        }
    }
    
    public reset(): void {
        this._actors.clear()
    }
    
    public count(): number {
        return this._actors.size
    }
}
