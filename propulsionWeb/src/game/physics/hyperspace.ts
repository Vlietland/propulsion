import { Actor, Vector } from 'excalibur'

export class Hyperspace {
    private mapWidth: number
    private mapHeight: number
    private tileWidth: number
    private tileHeight: number
    private hyperspaceBorderX: number
    private hyperspaceBorderY: number    

    constructor(map: any) {
        if (!map || !map.map) {
            throw new Error('Invalid map provided to Hyperspace')
        }
        this.mapWidth = map.map.width
        this.mapHeight = map.map.height
        this.tileWidth = map.map.tilewidth
        this.tileHeight = map.map.tileheight
        this.hyperspaceBorderX = map?.map?.properties?.find((p: any) => p.name === 'hyperspaceBorderX')?.value     
        this.hyperspaceBorderY = map?.map?.properties?.find((p: any) => p.name === 'hyperspaceBorderY')?.value
    }

    public checkHyperspaceReached(actor: Actor): boolean {
        const MARGIN = this.tileHeight / 2
        const reachedHyperspaceY = actor.pos.y <= this.tileHeight * this.hyperspaceBorderY + MARGIN
        const atMapEdge = this.isAtHorizontalEdge(actor.pos)
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