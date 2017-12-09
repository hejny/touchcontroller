export default class Vector2 {
    constructor(public x: number,
                public y: number) {
    }

    static Zero() {
        return new Vector2(0, 0);
    }

    clone(): Vector2 {
        return new Vector2(
            this.x,
            this.y
        );
    }

    add(vector2: Vector2): Vector2 {
        return new Vector2(
            this.x + vector2.x,
            this.y + vector2.y
        );
    }

    subtract(vector2: Vector2): Vector2 {
        return new Vector2(
            this.x - vector2.x,
            this.y - vector2.y
        );
    }

    scale(scale: number): Vector2 {
        return new Vector2(
            this.x * scale,
            this.y * scale
        );
    }

    length(vector2: Vector2 = Vector2.Zero()): number {
        return Math.sqrt(
            Math.pow(this.x - vector2.x, 2) +
            Math.pow(this.y - vector2.y, 2)
        )
    }

    toArray(): [number, number] {
        return [this.x, this.y];
    }
}