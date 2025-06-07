import { Vector } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'

export class Hyperspace {
    private mapWidth: number
    private tileWidth: number
    private tileHeight: number
    private hyperspaceBorderX: number
    private hyperspaceBorderY: number

    constructor(map: any) {
        if (!map || !map.map) {
            throw new Error('Invalid map provided')
        }
        this.mapWidth = map.map.width
        this.tileWidth = map.map.tilewidth
        this.tileHeight = map.map.tileheight
        this.hyperspaceBorderX = map?.map?.properties?.find((p: any) => p.name === 'hyperspaceBorderX')?.value     
        this.hyperspaceBorderY = map?.map?.properties?.find((p: any) => p.name === 'hyperspaceBorderY')?.value
    }

    public checkHyperspaceReached(shipActor: ShipActor): boolean {
        const MARGIN = this.tileHeight / 2
        const reachedHyperspaceY = shipActor.pos.y <= this.tileHeight * this.hyperspaceBorderY + MARGIN
        const atMapEdge = this.isAtHorizontalEdge(shipActor.pos)
        if (reachedHyperspaceY || atMapEdge) {
            return true
        }
        return false
    }

    private isAtHorizontalEdge(position: Vector): boolean {
        const MARGIN = this.tileWidth / 2
        const leftEdge = position.x <= (this.hyperspaceBorderX * this.tileWidth) + MARGIN 
        const rightEdge = position.x >= ((this.mapWidth - this.hyperspaceBorderX) * this.tileWidth) - MARGIN
        return leftEdge || rightEdge
    }
}