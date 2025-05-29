import { ImageSource, Vector } from 'excalibur'

export class CollisionPoints {
    public static getCollisionPoints(imageSource: ImageSource, targetPoints = 8): Vector[] {
        const img = imageSource.image
        const w = img.width, h = img.height
        if (w === 0 || h === 0) return []
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        const ctx = c.getContext('2d')
        if (!ctx) return []
        ctx.drawImage(img, 0, 0)
        const d = ctx.getImageData(0, 0, w, h).data
        const boundary: Vector[] = []
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
                    if (edge) boundary.push(new Vector(x, y))
                }
            }
        if (boundary.length <= targetPoints) return boundary
        return this.simplifyRDP(boundary, this.findEpsilon(boundary, targetPoints))
    }

    private static findEpsilon(points: Vector[], target: number): number {
        let eps = 1, min = 0, max = 50
        for (let i = 0; i < 20; i++) {
            const simplified = this.simplifyRDP(points, eps)
            if (simplified.length > target) min = eps
            else max = eps
            eps = (min + max) / 2
        }
        return eps
    }

    private static simplifyRDP(points: Vector[], epsilon: number): Vector[] {
        if (points.length < 3) return points
        const dmax = {d: 0, idx: 0}
        for (let i = 1; i < points.length - 1; i++) {
            const d = this.perpendicularDistance(points[i], points[0], points[points.length - 1])
            if (d > dmax.d) { dmax.d = d; dmax.idx = i }
        }
        if (dmax.d > epsilon) {
            const rec1 = this.simplifyRDP(points.slice(0, dmax.idx + 1), epsilon)
            const rec2 = this.simplifyRDP(points.slice(dmax.idx), epsilon)
            return rec1.slice(0, -1).concat(rec2)
        } else {
            return [points[0], points[points.length - 1]]
        }
    }

    private static perpendicularDistance(p: Vector, p1: Vector, p2: Vector): number {
        const num = Math.abs((p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x)
        const den = Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2)
        return den === 0 ? 0 : num / den
    }
}