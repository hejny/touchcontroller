export default class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static Zero(): Vector2;
    clone(): Vector2;
    add(vector2: Vector2): Vector2;
    subtract(vector2: Vector2): Vector2;
    scale(scale: number): Vector2;
    length(vector2?: Vector2): number;
    toArray(): [number, number];
}
