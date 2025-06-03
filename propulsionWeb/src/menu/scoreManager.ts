export class ScoreManager {
    private score: number = 0
    private observers: Array<(score: number) => void> = []

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
