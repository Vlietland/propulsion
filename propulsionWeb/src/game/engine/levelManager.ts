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
    
    private async checkTotalLevels(): Promise<void> {
        let level = 1
        let found = true
        this.totalLevels = 0
        
        while (found && level <= 100) {
            try {
                const response = await fetch(`${LEVEL_DATA_PATH}level${level}.json`, { method: 'HEAD' })
                if (response.ok) {
                    // Only increment the counter
                    level++
                } else {
                    found = false
                }
            } catch (error) {
                console.error(`Error checking level ${level}:`, error)
                found = false
            }
        }
        
        // After the loop, level is one more than the last level found
        this.totalLevels = level - 1
        
        console.log(`LevelManager: Found ${this.totalLevels} levels`)
        if (this.totalLevels === 0) {
            console.error('LevelManager: No levels found! Setting default to 1')
            this.totalLevels = 1
        }
    }
    
    async ensureInitialized(): Promise<void> {
        if (this.levelCheckPromise) {
            await this.levelCheckPromise
        }
    }
    
    async getMap(scene: Scene): Promise<any> {
        return await this.mapRenderer.loadAndRenderMap(scene, this.getLevelFilename())
    }
    
    getLevelFilename(): string {
        return `level${this.currentLevel}.json`
    }
    
    nextLevel(): boolean {
        if (this.currentLevel < this.totalLevels) {
            this.currentLevel++
            return true
        }
        return false
    }
    
    resetToFirstLevel(): void {
        this.currentLevel = 1
    }
    
    getCurrentLevel(): number {
        return this.currentLevel
    }
    
    getTotalLevels(): number {
        return this.totalLevels
    }
    
    isLastLevel(): boolean {
        return this.currentLevel >= this.totalLevels
    }
    
    setLevel(level: number): boolean {
        if (level >= 1 && level <= this.totalLevels) {
            this.currentLevel = level
            return true
        }
        return false
    }
}