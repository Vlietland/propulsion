export interface HighScoreEntry {
    score: number
    position: number
    name?: string
}

export class ScoreManager {
    private score = 0
    private observers: Array<(score: number) => void> = []
    private highScores: Array<{score: number, name: string}> = []

    constructor() {
        this.initializeHighScores()
    }

    private initializeHighScores() {
        const savedScores = localStorage.getItem('propulsion-high-scores')
        if (savedScores) {
            try {
                const parsed = JSON.parse(savedScores)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    if (typeof parsed[0] === 'number') {
                        this.setDefaultHighScores()
                    } else {
                        this.highScores = parsed
                    }
                } else {
                    this.setDefaultHighScores()
                }
            } catch (e) {
                this.setDefaultHighScores()
            }
        } else {
            this.setDefaultHighScores()
        }
        
        while (this.highScores.length < 8) {
            this.highScores.push({ score: 1000, name: 'ANONYMOUS' })
        }
        this.highScores = this.highScores.slice(0, 8)
        this.highScores.sort((a, b) => b.score - a.score)
    }

    private setDefaultHighScores() {
        this.highScores = [
            { score: 8000, name: 'ADMIRAL CHEN' },
            { score: 7000, name: 'CPT. RODRIGUEZ' },
            { score: 6000, name: 'CDR. WILLIAMS' },
            { score: 5000, name: 'LT.CDR. PATEL' },
            { score: 4000, name: 'LT. ANDERSON' },
            { score: 3000, name: 'ENS. JOHNSON' },
            { score: 2000, name: 'ENS. MARTINEZ' },
            { score: 1000, name: 'CADET SMITH' }
        ]
        this.saveHighScores()
    }

    private saveHighScores() {
        localStorage.setItem('propulsion-high-scores', JSON.stringify(this.highScores))
    }

    getScore() {
        return this.score
    }

    addScore(points: number) {
        this.score += points
        if (this.score < 0) this.score = 0
        this.notifyObservers()
    }

    resetScore() {
        this.score = 0
        this.notifyObservers()
    }

    getHighScores(): HighScoreEntry[] {
        return this.highScores.map((entry, index) => ({
            score: entry.score,
            position: index + 1,
            name: entry.name
        }))
    }

    highScoreApplicable(currentScore: number) {
        const lowestHighScore = Math.min(...this.highScores.map(entry => entry.score))
        return currentScore > lowestHighScore
    }

    addHighScore(score: number, name: string): { isHighScore: boolean, position?: number } {
        const lowestHighScore = Math.min(...this.highScores.map(entry => entry.score))
        if (score > lowestHighScore) {
            this.highScores.push({ score, name })
            this.highScores.sort((a, b) => b.score - a.score)
            this.highScores = this.highScores.slice(0, 8)
            this.saveHighScores()
            const position = this.highScores.findIndex(entry => entry.score === score && entry.name === name) + 1
            return { isHighScore: true, position }
        }
        return { isHighScore: false }
    }

    checkAndAddHighScore(score: number): { isHighScore: boolean, position?: number } {
        return this.addHighScore(score, 'ANONYMOUS')
    }

    addObserver(observer: (score: number) => void) {
        this.observers.push(observer)
        observer(this.score)
    }

    removeObserver(observer: (score: number) => void) {
        this.observers = this.observers.filter(obs => obs !== observer)
    }

    private notifyObservers() {
        this.observers.forEach(observer => observer(this.score))
    }
}
