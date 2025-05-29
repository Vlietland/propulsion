import { CollisionGroup, CollisionType, Shape, TileMap, Vector, Actor, Scene } from 'excalibur'

export class TileMapCollisionProcessor {
    private _wallColliders: Shape[] = []
    private _wallCollisionGroup: CollisionGroup
    
    constructor(wallCollisionGroup: CollisionGroup) {
        this._wallCollisionGroup = wallCollisionGroup
    }
    
    public processTileMap(tileMapOrLayer: any): void {
        this._wallColliders = []
        const tileMap = tileMapOrLayer.tilemap ? tileMapOrLayer.tilemap : tileMapOrLayer
        const edgeTiles = this.markEdgeTiles(tileMap)
        const rectangleColliders = this.createOptimizedRectangles(edgeTiles, tileMap)        
        this._wallColliders = rectangleColliders
    }
    
    public getColliders(): Shape[] {
        return this._wallColliders
    }

    public addWallCollisionToScene(scene: Scene): Actor[] {
        const wallActors: Actor[] = []
        
        for (const shape of this._wallColliders) {
            const boxShape = shape as any
            const centerX = boxShape.center ? boxShape.center.x : 0
            const centerY = boxShape.center ? boxShape.center.y : 0
            const width = boxShape.width || 16
            const height = boxShape.height || 16
            
            const wallActor = new Actor({
                pos: new Vector(centerX, centerY),
                width: width,
                height: height,
                collisionType: CollisionType.Fixed
            })
            
            wallActor.body.group = this._wallCollisionGroup
            
            scene.add(wallActor)
            wallActors.push(wallActor)
        }
        
        return wallActors
    }

    private markEdgeTiles(tileMap: TileMap): boolean[] {
        const width = tileMap.columns
        const height = tileMap.rows
        const needsCollider = new Array(width * height).fill(false)
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x
                const tile = tileMap.getTileByIndex(index)
                
                if (!tile || !tile.solid) continue
                
                // Safely check adjacent tiles
                const leftTile = x > 0 ? tileMap.getTile(x-1, y) : null
                const rightTile = x < width - 1 ? tileMap.getTile(x+1, y) : null
                const upTile = y > 0 ? tileMap.getTile(x, y-1) : null
                const downTile = y < height - 1 ? tileMap.getTile(x, y+1) : null
                
                const hasAdjacentEmpty = 
                    (!leftTile || !leftTile.solid) ||
                    (!rightTile || !rightTile.solid) ||
                    (!upTile || !upTile.solid) ||
                    (!downTile || !downTile.solid)
                
                if (hasAdjacentEmpty) {
                    needsCollider[index] = true
                }
            }
        }
        
        return needsCollider
    }

    private createOptimizedRectangles(edgeTiles: boolean[], tileMap: TileMap): Shape[] {
        const width = tileMap.columns
        const height = tileMap.rows
        const tileWidth = tileMap.tileWidth
        const tileHeight = tileMap.tileHeight
        const rectangles: Shape[] = []
        const visited = new Array(edgeTiles.length).fill(false)
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x
                
                if (!edgeTiles[index] || visited[index]) continue
                
                let maxWidth = 1
                while (x + maxWidth < width && 
                       edgeTiles[y * width + (x + maxWidth)] && 
                       !visited[y * width + (x + maxWidth)]) {
                    maxWidth++
                }
                
                let maxHeight = 1
                let isRect = true
                while (isRect && y + maxHeight < height) {
                    for (let w = 0; w < maxWidth; w++) {
                        const checkIndex = (y + maxHeight) * width + (x + w)
                        if (!edgeTiles[checkIndex] || visited[checkIndex]) {
                            isRect = false
                            break
                        }
                    }
                    if (isRect) maxHeight++
                }
                
                for (let h = 0; h < maxHeight; h++) {
                    for (let w = 0; w < maxWidth; w++) {
                        visited[(y + h) * width + (x + w)] = true
                    }
                }
                
                const centerX = (x + maxWidth / 2) * tileWidth
                const centerY = (y + maxHeight / 2) * tileHeight
                
                const box = Shape.Box(
                    maxWidth * tileWidth,
                    maxHeight * tileHeight,
                    new Vector(centerX, centerY),
                    Vector.Zero
                )
                
                rectangles.push(box)
            }
        }
        
        return rectangles
    }
}
