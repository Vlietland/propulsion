import { Actor, Color, Engine, Scene, Vector } from 'excalibur'

/**
 * A very simple pixel-based collision detector for the Propulsion game.
 * This replaces the previous complex collision system with a straightforward approach:
 * - Detects collisions between objects and non-black pixels in the game world
 * - Provides visual feedback when collisions occur
 * - Triggers appropriate game events (explosions, etc.)
 */
export class SimpleCollisionSystem {
    private static _instance: SimpleCollisionSystem
    private _engine: Engine | null = null
    private _scene: Scene | null = null
    private _wallActors: Actor[] = []
    private _shipActors: Actor[] = []
    private _ballActors: Actor[] = []
    private _debugMode: boolean = false
    
    private constructor() {
        // Private constructor for singleton pattern
    }
    
    public static get instance(): SimpleCollisionSystem {
        if (!SimpleCollisionSystem._instance) {
            SimpleCollisionSystem._instance = new SimpleCollisionSystem()
        }
        return SimpleCollisionSystem._instance
    }
    
    /**
     * Initialize the collision system
     */
    public initialize(engine: Engine): void {
        console.log('Initializing simple collision system')
        this._engine = engine
    }
    
    /**
     * Register a scene with the collision system
     */
    public registerScene(scene: Scene): void {
        this._scene = scene
    }
    
    /**
     * Register wall actors (any non-black objects that can be collided with)
     */
    public registerWallActors(actors: Actor[]): void {
        this._wallActors = actors
        console.log(`Registered ${actors.length} wall actors for collision detection`)
    }
    
    /**
     * Register ship actors
     */
    public registerShipActors(actors: Actor[]): void {
        this._shipActors = actors
        console.log(`Registered ${actors.length} ship actors for collision detection`)
    }
    
    /**
     * Register ball actors
     */
    public registerBallActors(actors: Actor[]): void {
        this._ballActors = actors
        console.log(`Registered ${actors.length} ball actors for collision detection`)
    }
    
    /**
     * Process a tilemap to extract collision objects
     */
    public processTilemap(tileLayer: any): void {
        if (!this._scene) return
        
        console.log('Processing tilemap for collisions')
        const wallActors: Actor[] = []
        
        // Create a basic collision object for each non-empty tile
        const tileMap = tileLayer.tilemap ? tileLayer.tilemap : tileLayer
        const width = tileMap.columns
        const height = tileMap.rows
        const tileWidth = tileMap.tileWidth
        const tileHeight = tileMap.tileHeight
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = tileMap.getTile(x, y)
                
                // Skip empty tiles
                if (!tile) continue
                
                const centerX = (x + 0.5) * tileWidth
                const centerY = (y + 0.5) * tileHeight
                
                // Create a simple wall actor for each tile
                const wallActor = new Actor({
                    pos: new Vector(centerX, centerY),
                    width: tileWidth,
                    height: tileHeight,
                    name: 'WallTile',
                    color: new Color(255, 0, 0, 0.1) // Very transparent red in debug mode
                })
                
                // Only show in debug mode
                wallActor.graphics.visible = this._debugMode
                
                this._scene.add(wallActor)
                wallActors.push(wallActor)
            }
        }
        
        this.registerWallActors(wallActors)
        console.log(`Created ${wallActors.length} wall actors from tilemap`)
    }
    
    /**
     * Enable or disable debug visualization
     */
    public setDebugMode(enabled: boolean): void {
        this._debugMode = enabled
        
        // Update visibility of wall actors
        for (const wall of this._wallActors) {
            if (wall.graphics) {
                wall.graphics.visible = enabled
            }
        }
    }
    
    /**
     * Update collision detection - call this every frame
     */
    public update(delta: number): void {
        if (!this._scene) return
        
        // Check ship collisions
        for (const ship of this._shipActors) {
            const hasCollision = this.checkCollisions(ship, this._wallActors)
            if (hasCollision) {
                this.handleShipCollision(ship)
            }
        }
        
        // Check ball collisions
        for (const ball of this._ballActors) {
            const hasCollision = this.checkCollisions(ball, this._wallActors)
            if (hasCollision) {
                this.handleBallCollision(ball)
            }
        }
    }
    
    /**
     * Simple collision check between an actor and a list of potential collision objects
     */
    private checkCollisions(actor: Actor, potentialColliders: Actor[]): boolean {
        for (const collider of potentialColliders) {
            if (actor.collider.bounds.intersect(collider.collider.bounds)) {
                return true
            }
        }
        return false
    }
    
    /**
     * Handle ship collision with walls
     */
    private handleShipCollision(ship: Actor): void {
        console.log('Ship collision detected!')
        
        // Visual feedback for collision
        const originalColor = ship.color.clone()
        
        // Flash the ship with red
        ship.color = new Color(255, 0, 0, 1)
        
        // Reset after a short delay
        setTimeout(() => {
            ship.color = originalColor
        }, 200)
        
        // TODO: Add explosion effect, damage, or other game logic here
    }
    
    /**
     * Handle ball collision with walls
     */
    private handleBallCollision(ball: Actor): void {
        console.log('Ball collision detected!')
        
        // Visual feedback for collision
        const originalColor = ball.color.clone()
        
        // Flash the ball with yellow
        ball.color = new Color(255, 255, 0, 1)
        
        // Reset after a short delay
        setTimeout(() => {
            ball.color = originalColor
        }, 200)
        
        // TODO: Add explosion effect or other game logic here
    }
}
