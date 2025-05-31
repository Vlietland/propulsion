export class ScoreManager {
    private score: number = 0

    getScore(): number {
        return this.score
    }

    addPoints(points: number): void {
        this.score += points
    }

    resetScore(): void {
        this.score = 0
    }
}
