import { Vector2 } from './../Vector2';
export declare class Particle {
    center: Vector2;
    zIndex: number;
    position: Vector2;
    rotation: number;
    width: number;
    private image;
    movement: Vector2;
    rotationMovement: number;
    growth: number;
    constructor(src: string, center: Vector2, zIndex: number, position: Vector2, rotation: number, width: number);
    readonly size: Vector2;
    readonly live: boolean;
    render(ctx: CanvasRenderingContext2D): void;
    static compare(a: Particle, b: Particle): number;
}
