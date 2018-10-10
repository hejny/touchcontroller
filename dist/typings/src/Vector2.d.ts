export declare class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static Zero(): Vector2;
    static One(): Vector2;
    clone(): Vector2;
    add(...vectors: Vector2[]): Vector2;
    addInPlace(...vectors: Vector2[]): this;
    static add(...vectors: Vector2[]): Vector2;
    subtract(vector2: Vector2): Vector2;
    subtractInPlace(vector2: Vector2): this;
    scale(scale: number): Vector2;
    scaleInPlace(scale: number): this;
    length(vector2?: Vector2): number;
    rotation(vector2?: Vector2): number;
    rotate(radians: number, vector2?: Vector2): Vector2;
    toArray(): [number, number];
    toString(): string;
    static fromTopLeft(boundingBox: {
        top: number;
        left: number;
    }): Vector2;
}
