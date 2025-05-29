import { Actor, CollisionGroup } from 'excalibur'
import { CollisionRegistry } from './collisionRegistry'

export class CollisionDetector {
    private _registry: CollisionRegistry

    constructor(registry: CollisionRegistry) {
        this._registry = registry
    }

    public isColliding(actorA: Actor, actorB: Actor): boolean {
        return actorA.collider.collide(actorB.collider).length > 0
    }

    public findCollisionsWithActor(actor: Actor, groupNames?: string[]): Actor[] {
        const collisions: Actor[] = []
        
        // Filter by collision groups if specified
        let actorsToCheck = this._registry.getAllActors()
        
        if (groupNames && groupNames.length > 0) {
            actorsToCheck = actorsToCheck.filter(otherActor => {
                if (otherActor === actor || !otherActor.body.group) return false
                
                // Check if the other actor belongs to any of the specified groups
                return groupNames.some(groupName => {
                    const group = otherActor.body.group
                    return group && group.name === groupName
                })
            })
        } else {
            actorsToCheck = actorsToCheck.filter(otherActor => otherActor !== actor)
        }
        
        // Check for collisions
        for (const otherActor of actorsToCheck) {
            if (this.isColliding(actor, otherActor)) {
                collisions.push(otherActor)
            }
        }
        
        return collisions
    }
}
