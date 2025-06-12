import { Scene } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'

// For debugging - log what value is coming from Vite's define
console.log('ENV BASE LEVEL:', (window as any).__BASE_LEVEL__)
const FIRST_LEVEL = parseInt((window as any).__BASE_LEVEL__ || '1')

export class LevelManager {
    private mapRenderer: MapRenderer
    private currentLevel: number = FIRST_LEVEL
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
    
    public resetToFirstLevel(): void {  this.currentLevel = FIRST_LEVEL }
    public getCurrentLevel(): number { return this.currentLevel }

    public async getMap(scene: Scene): Promise<any> {
        return await this.mapRenderer.loadAndRenderMap(scene, this.getLevelFilename())
    }

    public async ensureInitialized(): Promise<void> {
        if (this.levelCheckPromise) await this.levelCheckPromise }

    private async checkTotalLevels(): Promise<void> {
        const basePath = (window as any).__ASSET_BASE_PATH__ || '/propulsion'
        let level = FIRST_LEVEL
        this.totalLevels = 0
        while (level <= 20) {
            const levelUrl = `${basePath}/levels/level${level}.json`
            try {
                const response = await fetch(levelUrl)
                if (!response.ok) break
                const content = await response.text()
                if (!content.trim().startsWith('{')) break
                this.totalLevels = level
                level++
            } catch {
                break
            }
        }
        if (this.totalLevels === 0) this.totalLevels = 1
    }    
        
    private getLevelFilename(): string { return `level${this.currentLevel}.json` }
}