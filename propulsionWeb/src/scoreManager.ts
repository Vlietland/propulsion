export interface HighScoreEntry {
    score: number
    position: number
}

export class ScoreManager {
    private score: number = 0
    private observers: Array<(score: number) => void> = []
    private highScores: number[] = []

    constructor() {
        this.initializeHighScores()
    }

    private initializeHighScores(): void {
        const savedScores = localStorage.getItem('propulsion-high-scores')
        if (savedScores) this.highScores = JSON.parse(savedScores)
        else this.highScores = [8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 1000]
        while (this.highScores.length < 8) this.highScores.push(1000)
        this.highScores = this.highScores.slice(0, 8)
        this.highScores.sort((a, b) => b - a) // Sort descending
    }

    private saveHighScores(): void {
        localStorage.setItem('propulsion-high-scores', JSON.stringify(this.highScores))
    }

    getScore(): number {
        return this.score
    }

    addScore(points: number): void {
        this.score += points
        if (this.score < 0) this.score = 0
        this.notifyObservers()
    }

    resetScore(): void {
        this.score = 0
        this.notifyObservers()
    }

    getHighScores(): HighScoreEntry[] {
        return this.highScores.map((score, index) => ({
            score, position: index + 1
        }))
    }

    checkAndAddHighScore(score: number): { isHighScore: boolean, position?: number } {
        const lowestHighScore = Math.min(...this.highScores)
        if (score > lowestHighScore) {
            this.highScores.push(score)
            this.highScores.sort((a, b) => b - a)
            this.highScores = this.highScores.slice(0, 8)
            this.saveHighScores()
            const position = this.highScores.indexOf(score) + 1
            return { isHighScore: true, position }
        }
        return { isHighScore: false }
    }

    public addObserver(observer: (score: number) => void): void {
        this.observers.push(observer)
        observer(this.score)
    }

    public removeObserver(observer: (score: number) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer)
    }

    private notifyObservers(): void {
        this.observers.forEach(observer => observer(this.score))
    }
}
