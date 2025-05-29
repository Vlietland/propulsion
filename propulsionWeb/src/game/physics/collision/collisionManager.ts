import { Actor, Engine, Ray, Scene, Shape, TileMap, Vector } from 'excalibur'
import { TileMapCollisionProcessor } from './tileMapCollisionProcessor'
import { CollisionGroupManager } from './collisionGroupManager'
import { CollisionRegistry } from './collisionRegistry'
import { CollisionDetector } from './collisionDetector'
import { CollisionResponseHandler } from './collisionResponseHandler'
import { CollisionDebugger } from './collisionDebugger'

export class CollisionManager {
    private static _instance: CollisionManager

    private _engine: Engine | null = null
    private _wallColliders: Shape[] = []
    private _tileMapProcessor: TileMapCollisionProcessor | null = null
    
    // Component references
    private _groupManager: CollisionGroupManager
    private _registry: CollisionRegistry
    private _detector: CollisionDetector
    private _responseHandler: CollisionResponseHandler
    private _debugger: CollisionDebugger

    public static get instance(): CollisionManager {
        if (!CollisionManager._instance) {
            CollisionManager._instance = new CollisionManager()
        }
        return CollisionManager._instance
    }

    private constructor() {
        // Initialize all our specialized components
        this._groupManager = new CollisionGroupManager()
        this._registry = new CollisionRegistry(this._groupManager)
        this._detector = new CollisionDetector(this._registry)
        this._responseHandler = new CollisionResponseHandler(this._detector, this._registry)
        this._debugger = new CollisionDebugger(this._registry, this._groupManager)
    }

    public initialize(engine: Engine): void {
        this._engine = engine
        
        const wallCollisionGroup = this._groupManager.getCollisionGroup('Wall')
        
        if (wallCollisionGroup) {
            this._tileMapProcessor = new TileMapCollisionProcessor(wallCollisionGroup)
        } else {
            console.error('Wall collision group not found')
        }
        
        // Initialize all components that need the engine
        this._responseHandler.initialize(engine)
        this._debugger.initialize(engine)
        
        // Configure collision relationships
        this._groupManager.configureCollisionRelationships()
    }

    // Delegate methods to appropriate components
    
    // CollisionGroupManager methods
    public getCollisionGroup(name: string) {
        return this._groupManager.getCollisionGroup(name)
    }
    
    public configureCollisionRelationships(): void {
        this._groupManager.configureCollisionRelationships()
    }
    
    // CollisionRegistry methods
    public registerActor(actor: Actor, groupName: string): void {
        this._registry.registerActor(actor, groupName)
    }
    
    public unregisterActor(actor: Actor): void {
        this._registry.unregisterActor(actor)
    }
    
    public getRegisteredActor(id: string): Actor | undefined {
        return this._registry.getRegisteredActor(id)
    }
    
    public getActorsByGroup(groupName: string): Actor[] {
        return this._registry.getActorsByGroup(groupName)
    }
    
    public registerAllActors(scene: Scene): void {
        this._registry.registerAllActors(scene)
    }
    
    // CollisionDetector methods
    public isColliding(actorA: Actor, actorB: Actor): boolean {
        return this._detector.isColliding(actorA, actorB)
    }
    
    public findCollisionsWithActor(actor: Actor, groupNames?: string[]): Actor[] {
        return this._detector.findCollisionsWithActor(actor, groupNames)
    }
    
    // TileMapCollisionProcessor methods
    public processTileMap(tileMap: TileMap): void {
        if (!this._tileMapProcessor) {
            console.error('TileMapCollisionProcessor not initialized')
            return
        }

        this._tileMapProcessor.processTileMap(tileMap)
        this._wallColliders = this._tileMapProcessor.getColliders()
        this._debugger.setWallColliders(this._wallColliders)
        
        if (this._engine && this._engine.currentScene) {
            this._tileMapProcessor.addWallCollisionToScene(this._engine.currentScene)
        }
    }
    
    // Raycasting is handled by the CollisionManager itself since it needs direct access to the scene
    public raycast(origin: Vector, direction: Vector, maxDistance: number, groupNames?: string[]): any[] {
        if (!this._engine) return []

        const ray = new Ray(origin, direction.normalize())
        const scene = this._engine.currentScene
        
        // Convert group names to actual collision groups
        let collisionGroups = undefined
        if (groupNames && groupNames.length > 0) {
            collisionGroups = groupNames
                .map(name => this._groupManager.getCollisionGroup(name))
                .filter(Boolean) as any[]
        }
        
        const hits = scene.physics.rayCast(ray, { maxDistance })
        
        if (collisionGroups && collisionGroups.length > 0) {
            return hits.filter((hit: any) => 
                hit.actor && hit.actor.body && 
                collisionGroups.some(group => hit.actor.body.group === group)
            )
        }
        
        return hits
    }
    
    // CollisionResponseHandler methods
    public update(delta: number): void {
        this._responseHandler.update(delta)
    }
    
    // CollisionDebugger methods
    public enableDebugDrawing(): void {
        this._debugger.enableDebugDrawing()
    }
    
    public disableDebugDrawing(): void {
        this._debugger.disableDebugDrawing()
    }
    
    public getCollisionStats(): { actorCount: number, wallColliderCount: number, activeGroups: string[] } {
        return this._debugger.getCollisionStats()
    }
    
    public toggleCollisionGroup(name: string, enabled: boolean): void {
        this._debugger.toggleCollisionGroup(name, enabled)
    }
    
    // Reset function
    public reset(): void {
        this._registry.reset()
        this._wallColliders = []
        this._debugger.setWallColliders(this._wallColliders)
    }
}
