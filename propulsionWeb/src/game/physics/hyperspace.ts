import { Vector } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'

const HYPER_SPACE_BOUNDARY_HEIGHT = 10

export class Hyperspace {
    private mapWidth: number
    private mapHeight: number
    private tileWidth: number
    private tileHeight: number
    private hyperspaceBoundaryDepth: number
    private onHyperspaceReachedCallback?: () => void

    constructor(map: any) {
        if (!map || !map.map) {
            throw new Error('Invalid map provided to Hyperspace')
        }
        this.mapWidth = map.map.width
        this.mapHeight = map.map.height
        this.tileWidth = map.map.tilewidth
        this.tileHeight = map.map.tileheight
        this.hyperspaceBoundaryDepth = HYPER_SPACE_BOUNDARY_HEIGHT * this.tileHeight
    }

    public checkHyperspaceReached(ship: ShipActor): boolean {
        if (!ship) return false
        const shipPos = ship.pos
        const reachedHyperspaceY = shipPos.y <= 2*this.tileHeight
        const atMapEdge = this.isAtHorizontalEdge(shipPos)
        if (reachedHyperspaceY || atMapEdge) {
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
}