import { ImageSource, Vector } from 'excalibur'

export class CollisionPoints {
    public static getCollisionPoints(imageSource: ImageSource, count = 8): Vector[] {
        const img = imageSource.image
        const w = img.width, h = img.height
        if (w === 0 || h === 0) return []
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const ctx = c.getContext('2d')
        if (!ctx) return []
        ctx.drawImage(img, 0, 0)
        const d = ctx.getImageData(0, 0, w, h).data
        const edgePoints: Vector[] = []
        for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4 + 3
                if (d[idx] > 0) {
                    let edge = false
                    for (let dy = -1; dy <= 1 && !edge; dy++)
                        for (let dx = -1; dx <= 1 && !edge; dx++) {
                            if (dx === 0 && dy === 0) continue
                            const nx = x + dx, ny = y + dy
                            if (nx < 0 || ny < 0 || nx >= w || ny >= h) edge = true
                            else if (d[(ny * w + nx) * 4 + 3] === 0) edge = true
                        }
                    if (edge) edgePoints.push(new Vector(x, y))
                }
            }
        if (edgePoints.length <= count) return edgePoints
        const step = Math.max(1, Math.floor(edgePoints.length / count))
        const points: Vector[] = []
        for (let i = 0; i < edgePoints.length && points.length < count; i += step) points.push(edgePoints[i])
        return points
    }
}