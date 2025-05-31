import { Scene } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'
import { TiledResource } from '@excalibur-tiled/resource/tiled-resource'

const LEVEL_DATA_PATH = '/levels/'

export class LevelManager {
    private mapRenderer: MapRenderer
    private currentLevel: number = 1
    private totalLevels: number = 1
    private levelCheckPromise: Promise<void> | null = null
    
    constructor() {
        this.mapRenderer = new MapRenderer()
        this.levelCheckPromise = this.checkTotalLevels()
    }
            
    public nextLevel(): boolean {
        if (this.currentLevel < this.totalLevels) {
            this.currentLevel++
            return true
        }
        return false
    }
    
    public resetToFirstLevel(): void {  this.currentLevel = 1 }
    public getCurrentLevel(): number { return this.currentLevel }

    public async getMap(scene: Scene): Promise<any> {
        return await this.mapRenderer.loadAndRenderMap(scene, this.getLevelFilename())
    }

    public async ensureInitialized(): Promise<void> {
        if (this.levelCheckPromise) await this.levelCheckPromise }

    private async checkTotalLevels(): Promise<void> {
        let level = 1
        let found = true
        this.totalLevels = 0
        
        while (found && level <= 100) {
            try {
                const response = await fetch(`${LEVEL_DATA_PATH}level${level}.json`, { method: 'HEAD' })
                if (response.ok) {
                    level++
                } else {
                    found = false
                }
            } catch (error) {
                console.error(`Error checking level ${level}:`, error)
                found = false
            }
        }
        this.totalLevels = level - 1        
        console.log(`LevelManager: Found ${this.totalLevels} levels`)
        if (this.totalLevels === 0) {
            console.error('LevelManager: No levels found! Setting default to 1')
            this.totalLevels = 1
        }
    }    
        
    private getLevelFilename(): string { return `level${this.currentLevel}.json` }
    private isLastLevel(): boolean { return this.currentLevel >= this.totalLevels }
}