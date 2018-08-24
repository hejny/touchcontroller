import Vector2 from './Vector2';
import Transformation from './Transformation';
export default class BoundingBox {
    center: Vector2;
    size: Vector2;
    rotation: number;
    constructor(center?: Vector2, size?: Vector2, rotation?: number);
    static One(): BoundingBox;
    static fromMinMax(maxx: number, maxy: number, minx: number, miny: number, rotation: number): BoundingBox;
    clone(): BoundingBox;
    cloneDeep(): BoundingBox;
    applyTransformation(transformation: Transformation): void;
    intersects(position: Vector2): boolean;
    grow(amount: number): BoundingBox;
    rotate(radians?: number, position?: Vector2): void;
    isIn(outerBoard: BoundingBox): boolean;
    topLeft: Vector2;
    readonly topRight: Vector2;
    readonly bottomLeft: Vector2;
    readonly bottomRight: Vector2;
    countTransformation(destinationBoundingBox: BoundingBox): Transformation;
    redrawToElement(boundingBoxElement: HTMLDivElement): void;
}
