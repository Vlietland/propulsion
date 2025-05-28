# Excalibur.js Collision Architecture Feature Plan

## Overview
This document outlines the implementation plan for enhancing the collision detection and response system in the Propulsion game. The goal is to create an extensible, performant collision architecture that properly handles interactions between game objects.

## Core Components
Read the agentinstructions.md !!!!

### 1. Collision Manager

#### 1.1. Core Architecture
- Create a centralized `CollisionManager` class to handle all collision logic
- Implement a singleton pattern for global access
- Separate collision detection from collision response logic
- Provide a clean API for other components to query collision information

#### 1.2. Initialization Flow
- Initialize the manager after map and actors are loaded
- Process tile map data to create optimized colliders
- Register all actors with the collision system
- Configure collision group relationships

#### 1.3. Advanced Detection Methods
- Provide methods for pixel-perfect collision when needed
- Support ray-casting for line-of-sight checks (useful for lasers)
- Allow for different collision shapes (circles, polygons) based on actor types
- Implement spatial partitioning for large maps

#### 1.4. Debugging & Development Support
- Expose debugging options to visualize collision boundaries
- Track collision statistics for performance monitoring
- Provide collision event hooks for debugging purposes
- Support toggling collision groups on/off for testing

### 2. Collision Groups

#### 2.1. Group Classification System
- Use Excalibur's `CollisionGroupManager` to categorize objects
- Define specific groups: Ship, Ball, Wall, Reactor, Transformer, etc.
- Implement a flexible registration system for adding new collision groups
- Create a hierarchical relationship between groups for inheritance of properties

#### 2.2. Interaction Matrix
- Configure which groups should collide with each other using a matrix approach
- All mobile entities (Ship, Ball, ShipBullets, TurretBullets) must collide with all non-zero ID tiles/objects
- Define specific interaction rules:
  - Ship: Explodes on contact with any non-zero ID tile/object
  - Ball: Explodes on contact with any non-zero ID tile/object
  - ShipBullets: Destroy on contact with any non-zero ID tile/object
  - TurretBullets: Destroy on contact with any non-zero ID tile/object
  - When Ship, Ball, or Turret is hit by any bullet, the hit object explodes
- Support one-way collisions where needed (e.g., lasers affect ship but not vice versa)

#### 2.3. Collision Types Assignment
- Apply appropriate collision types to each actor (Active, Fixed, Passive)
- Map actor classes to specific collision behaviors automatically
- Allow for runtime changes to collision types based on game state
- Support composite colliders for complex objects

### 3. Wall Collision Optimization

#### 3.1. Edge-Only Detection
- Create colliders only for non-zero tiles adjacent to at least one zero tile
- Skip interior tiles completely (tiles surrounded by other non-zero tiles)
- Focus collision detection on the boundaries between navigable and non-navigable areas
- Support diagonal adjacency detection for more precise boundary definition
- Handle special cases like single-tile islands and narrow passages

#### 3.2. Boundary Analysis
- Identify and classify different boundary types (straight edges, corners, etc.)
- Detect natural collision zones based on map topology
- Pre-process the map to identify high-collision probability areas
- Create heat maps of likely collision zones for further optimization

```
// Example edge-detection algorithm
function markEdgeTiles(tilesData, width, height) {
  const needsCollider = new Array(tilesData.length).fill(false);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      
      // Skip empty tiles
      if (tilesData[index] === 0) continue;
      
      // Check if adjacent to an empty space (edge tile)
      const hasAdjacentEmpty = 
        (x > 0 && tilesData[index - 1] === 0) ||               // Left
        (x < width - 1 && tilesData[index + 1] === 0) ||        // Right
        (y > 0 && tilesData[index - width] === 0) ||            // Up
        (y < height - 1 && tilesData[index + width] === 0);     // Down
      
      if (hasAdjacentEmpty) {
        needsCollider[index] = true;
      }
    }
  }
  
  return needsCollider;
}
```

#### 3.3. Rectangle Grouping
- Group adjacent edge tiles into larger rectangular colliders
- Scan horizontally first, then vertically to create optimized rectangles
- Significantly reduces the number of collision objects
- Use greedy algorithm to find optimal rectangle placement
- Support non-rectangular shapes through composite rectangles

#### 3.4. Spatial Optimization
- Implement spatial partitioning (quadtree/grid) for large maps
- Only activate colliders near the player's current position
- Dynamically load/unload collision boundaries based on viewport
- Implement level-of-detail system for collision boundaries at different distances

```
// Pseudocode for rectangle grouping
function createOptimizedRectangles(edgeTiles, width, height) {
  const rectangles = [];
  const visited = new Array(edgeTiles.length).fill(false);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      
      // Skip if not an edge or already visited
      if (!edgeTiles[index] || visited[index]) continue;
      
      // Find maximum width for this starting position
      let maxWidth = 1;
      while (x + maxWidth < width && 
             edgeTiles[y * width + (x + maxWidth)] && 
             !visited[y * width + (x + maxWidth)]) {
        maxWidth++;
      }
      
      // Find maximum height for this width
      let maxHeight = 1;
      let isRect = true;
      while (isRect && y + maxHeight < height) {
        // Check if row can be added to rectangle
        for (let w = 0; w < maxWidth; w++) {
          const checkIndex = (y + maxHeight) * width + (x + w);
          if (!edgeTiles[checkIndex] || visited[checkIndex]) {
            isRect = false;
            break;
          }
        }
        if (isRect) maxHeight++;
      }
      
      // Mark all tiles in the rectangle as visited
      for (let h = 0; h < maxHeight; h++) {
        for (let w = 0; w < maxWidth; w++) {
          visited[(y + h) * width + (x + w)] = true;
        }
      }
      
      // Add the rectangle
      rectangles.push({
        x: x * tileSize,
        y: y * tileSize,
        width: maxWidth * tileSize,
        height: maxHeight * tileSize
      });
    }
  }
  
  return rectangles;
}
```

### 4. Object-Specific Collisions

#### 4.1. Small Objects Handling
- Create precise colliders for objects smaller than a single tile
- Add padding colliders where necessary for better gameplay feel
- Use appropriately sized collision shapes based on visual appearance
- Support multi-part colliders for complex objects
- Implement automatic collider generation based on sprite data

#### 4.2. Dynamic Objects
- Handle moving objects with predictive collision detection
- Optimize collision checks for fast-moving objects like lasers
- Support collision detection for rotating objects (important for ship)
- Implement continuous collision detection for high-velocity objects

#### 4.3. Collision Response System
- Define custom responses for different collision types
- Implement specialized behavior for ship vs. wall, ball vs. reactor, etc.
- Support callback-based collision response for custom logic
- Allow for multi-stage collision responses (e.g., damage then destroy)
- Create reusable collision response patterns

#### 4.4. Special Interactions
- Handle special case collisions like laser-object interactions
- When a bullet collides with a turret the turret explodes and deactivates.
- When a bullet collides with a transformer, the linked laser stops emitting laserbeam (deactivates). After 10 seconds the transformer is repaired and the laser is activated again.
- When 40 bullets hits the reactor the reactor deactivates and will explode within 10 seconds. When a reactor explodes the ship and ball also explodes (chain explosion)

#### 4.5. Laser Beam Implementation
- Implement laser beams as a series of connected tile objects that act as a thin wall
- Each laser generates beam tiles in its specified direction until hitting a wall or obstacle
- Use ray-casting to determine the extent of the beam and where tiles should be placed
- Each beam tile has its own collision properties but shares a common controller
- Support proper collision with the ship and other objects through the tile colliders
- Handle transparency in beam tiles by using narrow collision bounds or pixel-perfect detection when needed
- Allow beam tiles to be individually activated/deactivated for dynamic effects
- Support one-way collisions so that objects like the ship can't push the beam

```typescript
// Pseudocode for laser beam generation
function createLaserBeam(laser, direction) {
  // Use ray-casting to find where the beam will hit a wall
  const raycastResult = collisionManager.raycast(laser.pos, direction, maxDistance, [CollisionGroup.Wall]);
  
  // Calculate how many beam tiles we need to reach the wall
  const distance = raycastResult.hit ? laser.pos.distance(raycastResult.point) : maxDistance;
  const tileLength = LASER_BEAM_TILE.width;
  const numTiles = Math.floor(distance / tileLength);
  
  const beamTiles = [];
  
  // Create a chain of beam tiles from the laser to the wall
  for (let i = 0; i < numTiles; i++) {
    const position = laser.pos.add(direction.scale((i + 0.5) * tileLength));
    const beamTile = new LaserBeamTileActor(position, direction);
    beamTile.setParentLaser(laser);
    beamTiles.push(beamTile);
    scene.add(beamTile);
  }
  
  return beamTiles;
}
```

**Laser Beam Architecture Diagram**:
```
    +------------+     Controls    +---------------+
    |            |--------------->|               |
    |  LaserActor|                | LaserBeamTiles|
    |            |<---------------|   (Array)     |
    +------------+   Notifications+---------------+
          |                              |
          |                              |
          v                              v
    +---------------------------+  +------------------------+
    | Fires ray to detect walls |  | Each tile:            |
    | Calculates beam length    |  | - Passive collider    |
    | Creates beam tiles        |  | - Handles collisions  |
    | Manages beam lifecycle    |  | - Reports to parent   |
    +---------------------------+  +------------------------+
                                            |
                                            v
                                   +-----------------+
                                   | Ship collision  |
                                   | causes damage   |
                                   | to ship         |
                                   +-----------------+
```

**LaserBeamTileActor Class Structure**:
```typescript
class LaserBeamTileActor extends Actor {
    private parentLaser: LaserActor;
    private direction: Vector;
    private isActive: boolean = true;
    
    constructor(position: Vector, direction: Vector) {
        super({
            pos: position,
            width: LASER_BEAM_TILE.width,
            height: LASER_BEAM_TILE.height,
            collisionType: CollisionType.Fixed,  // Acts as a thin wall
            collisionGroup: CollisionGroups.LaserBeam
        });
        
        this.direction = direction;
        this.rotation = Math.atan2(direction.y, direction.x);
        this.graphics.use(LASER_BEAM_TILE.toSprite());
        
        // Use a narrow box collider to represent the beam
        this.collider.useBoxCollider(this.width, this.height * 0.4);
        this.collider.offset = new Vector(0, 0);
    }
    
    setParentLaser(laser: LaserActor): void {
        this.parentLaser = laser;
    }
    
    deactivate(): void {
        this.isActive = false;
        this.graphics.opacity = 0.3;
        this.collider.group = CollisionGroups.Inactive;
    }
    
    activate(): void {
        this.isActive = true;
        this.graphics.opacity = 1.0;
        this.collider.group = CollisionGroups.LaserBeam;
    }
    
    onInitialize(engine: Engine): void {
        // Subscribe to collision events with ship
        this.on('collisionstart', (evt: CollisionStartEvent) => {
            if (evt.other instanceof ShipActor) {
                // Inform the parent laser that the ship was hit
                this.parentLaser.onShipCollision(evt.other, this);
            }
        });
    }
}
```

The `LaserBeamTileActor` class is responsible for individual segments of the laser beam. Each tile:
- Has a fixed collision type to act as a thin wall
- Uses a narrow box collider to represent the beam's actual width
- Maintains a reference to its parent laser for communication
- Can be activated or deactivated when transformer is hit by a bullet
- Reports collisions with the ship back to the parent laser

### 5. Pixel-Perfect Collision Detection

#### 5.1. Precision Collision System (Optional)
- Use a two-phase approach: broad phase (bounding box) then narrow phase (pixel data)
- Apply only to ship and ball actor to maintain performance

#### 5.2. Optimization Techniques
- Cache collision mask data for static objects
- Use simplified contours instead of full pixel data where appropriate
- Implement resolution scaling for collision data to balance precision vs performance
- Support asynchronous collision checking for non-critical objects

#### 5.3. Integration with Physics
- Connect pixel-perfect collision detection with physics response
- Calculate collision normals based on pixel data for realistic responses
- Support penetration depth measurement for collision resolution
- Handle edge cases like tunneling through thin objects

#### 5.4. Specialized Use Cases
- High-precision collision for critical gameplay elements (ship nose, laser beams)
- Fallback mechanism when standard collision fails
- Visual debugging tools for pixel-perfect collision boundaries
- Support for irregularly shaped objects that don't fit standard colliders

```typescript
function pixelPerfectCollision(actorA, actorB) {
  // Broad phase - bounding box check
  if (!actorA.collider.bounds.overlaps(actorB.collider.bounds)) {
    return false;
  }
  
  // Narrow phase - pixel data check in the overlapping region
  const overlap = actorA.collider.bounds.intersection(actorB.collider.bounds);
  
  // Check pixel data within the overlap region...
  // Implementation depends on how sprite data is accessed
  
  return true; // If pixels overlap
}
```

## Implementation Priority

### Phase 1: Foundation
1. **Base Collision System**:
   - Create the CollisionManager class with core architecture
   - Set up collision groups registry
   - Implement basic collision detection
   - Integrate with SceneManager

### Phase 2: Core Optimizations
2. **Wall Optimization**:
   - Implement edge detection algorithm
   - Create optimized rectangular colliders
   - Test performance impact
   - Add spatial partitioning for large maps

### Phase 3: Gameplay Features
3. **Object-Specific Logic**:
   - Add specialized collision handling for game objects
   - Implement collision response behaviors
   - Set up the tractor beam physics
   - Create the ship-ball connection system
   - Implement the laser beam tile chain system

### Phase 4: Polish & Advanced Features
4. **Enhanced Collision Experience**:
   - Add pixel-perfect collision for critical interactions
   - Implement invisible padding colliders
   - Add debug visualization options
   - Fine-tune collision responses
   - Optimize for performance edge cases

## Performance Considerations

### 6.1. Benchmarking & Targets
- Target minimum 60 FPS even on large maps
- Establish performance budget for collision system (< 5ms per frame)
- Create benchmark tests for different map sizes and object counts
- Monitor memory usage for large levels

### 6.2. Optimization Techniques
- Monitor collision check count per frame and limit when necessary
- Use broad-phase collision detection to filter potential collisions
- Implement spatial partitioning to reduce collision checks
- Only apply pixel-perfect collision when absolutely necessary

### 6.3. Memory Management
- Pool collision objects to reduce garbage collection
- Cache collision data for static objects
- Use efficient data structures for collision tracking
- Implement object culling for offscreen entities

### 6.4. Scalability Considerations
- Design the system to scale with level size and complexity
- Support level of detail switching for collision boundaries
- Provide configuration options to balance quality vs performance
- Include fallback strategies for lower-end devices

## Integration Points

### 7.1. Core Game Components
- `SceneManager`: Initialize the collision system after loading map and actors
  - Register the CollisionManager as a system in the scene
  - Provide access to tile data and actor references
  - Handle scene transitions with collision system reset

- `ActorFactory`: Enhance to support collision system
  - Assign appropriate collision groups during actor creation
  - Set collision properties based on actor type
  - Create specialized colliders for complex objects
  - Register newly created actors with the CollisionManager
  - Provide factory methods for creating laser beam tile chains

### 7.2. Actor Integration
- `BaseActor`: Add collision interface and common functionality
  - Implement collision event subscription methods
  - Add collision response hooks
  - Support custom collision shapes
- `LaserActor`: Enhanced implementation
  - Use ray-casting to determine beam extent
  - Create and manage a chain of LaserBeamTileActor instances
  - Synchronize beam tile states (activate/deactivate)
  - Handle transformer-related events for beam control

### 7.3. Physics & Movement
- `Physics`: Extend to work with collision system
  - Integrate collision resolution with movement updates
  - Handle velocity changes from collision responses
  - Support different physical materials and interactions
  
### 7.4. System Architecture
- `CollisionManager`: The central coordination point
  - Provide public API for collision queries
  - Maintain collision state and history
  - Optimize collision detection based on scene state
  - Handle all collision resolution and event dispatching
  
- `EventSystem`: Enhance to support collision events
  - Dispatch collision events to interested subscribers
  - Buffer collision events for processing in the right order
  - Support collision event priorities
  - Enable custom collision response behaviors

### 7.5. Laser System Integration
- Lasers receive input from the game to create/remove beams
- Beam tiles are registered with the CollisionManager
- Laser beams interact with the ship through the normal collision system
- Transformers control laser beam activation states
- The HUD displays laser states when relevant

Integration Process:
1. When a laser is activated, it initiates ray-casting via the CollisionManager
2. The collision manager determines where the beam will terminate
3. The laser creates a series of beam tiles spanning from its emitter to the termination point
4. Each beam tile is registered with the collision system
5. The ship can collide with any beam tile, triggering damage/game logic
6. When a transformer is hit, it signals the associated laser to deactivate its beam tiles
