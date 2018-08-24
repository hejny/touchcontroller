//todo multidimensional
export default class Vector2 {
    constructor(public x: number, public y: number) {}

    static Zero() {
        return new Vector2(0, 0);
    }

    static One() {
        return new Vector2(1, 1);
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    //todo consolidate 2 add methods and 1 static method
    add(...vectors: Vector2[]): Vector2 {
        return new Vector2(
            vectors.reduce((x, vector2) => x + vector2.x, this.x),
            vectors.reduce((y, vector2) => y + vector2.y, this.y),
        );
    }

    addInPlace(...vectors: Vector2[]): void {
        //todo void vs. never
        for (const vector of vectors) {
            this.x += vector.x;
            this.y += vector.y;
        }
    }

    static add(...vectors: Vector2[]) {
        return new Vector2(
            vectors.reduce((x, vector2) => x + vector2.x, 0),
            vectors.reduce((y, vector2) => y + vector2.y, 0),
        );
    }

    subtract(vector2: Vector2): Vector2 {
        return new Vector2(this.x - vector2.x, this.y - vector2.y);
    }

    scale(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }

    scaleInPlace(scale: number): void {
        this.x *= scale;
        this.y *= scale;
    }

    length(vector2: Vector2 = Vector2.Zero()): number {
        return Math.sqrt(
            Math.pow(this.x - vector2.x, 2) + Math.pow(this.y - vector2.y, 2),
        );
    }

    rotation(vector2: Vector2 = Vector2.Zero()): number {
        return Math.atan2(this.y - vector2.y, this.x - vector2.x);
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
