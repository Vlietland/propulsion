import * as ex from 'excalibur'

export class GameCanvas {
    private canvasId: string

    constructor(canvasId: string = 'gameCanvas') {
        this.canvasId = canvasId
        this.initializeCanvas()
    }

    private initializeCanvas(): void {
        const existingCanvas = document.getElementById(this.canvasId)
        if (!existingCanvas) {
            const canvas = document.createElement('canvas')
            canvas.id = this.canvasId
            document.body.appendChild(canvas)
        }
    }

    createEngine(): ex.Engine {
        return new ex.Engine({
            canvasElementId: this.canvasId,
            width: 800,
            height: 600,
            displayMode: ex.DisplayMode.FitScreen,
            backgroundColor: ex.Color.Black,
        })
    }
}
