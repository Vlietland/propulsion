import { Vector } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'

export class Hyperspace {
    private mapWidth: number
    private mapHeight: number
    private tileWidth: number
    private tileHeight: number
    private hyperspaceBoundaryHeight: number
    private onHyperspaceReachedCallback?: () => void

    constructor(map: any) {
        if (!map || !map.map) {
            throw new Error('Invalid map provided to Hyperspace')
        }

        this.mapWidth = map.map.width
        this.mapHeight = map.map.height
        this.tileWidth = map.map.tileWidth
        this.tileHeight = map.map.tileHeight
        
        // Define hyperspace zone as top 10 rows
        this.hyperspaceBoundaryHeight = 10 * this.tileHeight
    }

    public checkHyperspaceReached(ship: ShipActor): boolean {
        if (!ship) return false
        
        const shipPos = ship.pos
        const reachedHyperspaceY = shipPos.y <= this.hyperspaceBoundaryHeight
        const atMapEdge = this.isAtHorizontalEdge(shipPos)
        
        // Ship must be at the top edge (Y) and at a horizontal edge (X)
        if (reachedHyperspaceY && atMapEdge && ship.isBallConnected()) {
            if (this.onHyperspaceReachedCallback) {
                this.onHyperspaceReachedCallback()
            }
            return true
        }
        
        return false
    }

    private isAtHorizontalEdge(position: Vector): boolean {
        const boundaryTiles = 10
        const leftEdge = position.x <= boundaryTiles * this.tileWidth
        const rightEdge = position.x >= (this.mapWidth - boundaryTiles) * this.tileWidth
        
        return leftEdge || rightEdge
    }

    public setHyperspaceReachedCallback(callback: () => void): void {
        this.onHyperspaceReachedCallback = callback
    }
    
    public getHyperspaceBoundaryHeight(): number {
        return this.hyperspaceBoundaryHeight
    }
}