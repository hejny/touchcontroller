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

    add(...vectors: Vector2[]): Vector2 {
        return new Vector2(
            vectors.reduce((x, vector2) => x + vector2.x, this.x),
            vectors.reduce((y, vector2) => y + vector2.y, this.y)
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

    rotation(vector2: Vector2 = Vector2.Zero()): number {
        return Math.atan2(
            this.y - vector2.y,
            this.x - vector2.x
        )
    }

    rotate(radians: number, vector2: Vector2 = Vector2.Zero()) {
        const base = this.subtract(vector2);
        const length = base.length();
        const rotation = base.rotation();
        return new Vector2(
            Math.cos(rotation + radians) * length,
            Math.sin(rotation + radians) * length,
        ).add(vector2);
    }

    toArray(): [number, number] {
        return [this.x, this.y];
    }

    toString(): string {
        return `[${this.x}, ${this.y}]`;
    }
}