export default class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static Zero(): Vector2;
    clone(): Vector2;
    add(...vectors: Vector2[]): Vector2;
    subtract(vector2: Vector2): Vector2;
    scale(scale: number): Vector2;
    length(vector2?: Vector2): number;
    rotation(vector2?: Vector2): number;
    rotate(radians: number, vector2?: Vector2): Vector2;
    toArray(): [number, number];
}
