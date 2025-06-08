import { Scene } from 'excalibur'
import { MapRenderer } from '@src/game/engine/mapRenderer'

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
        const basePath = __ASSET_BASE_PATH__ || ''
        let level = 1
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