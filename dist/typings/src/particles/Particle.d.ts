import { Vector2 } from './../Vector2';
export interface IParticleOptions {
    shapeSrc: string;
    shapeCenter: Vector2;
    color: string;
    current: IParticleOptionsExternals;
    movement: IParticleOptionsExternals;
    friction: number;
}
export interface IParticleOptionsExternals {
    position: Vector2;
    rotation: number;
    widthSize: number;
}
export declare class Particle {
    private options;
    zIndex: number;
    private shapeData;
    constructor(options: IParticleOptions, zIndex: number);
    initializeSource(): Promise<void>;
    readonly size: Vector2;
    readonly live: boolean;
    update(delta: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    static compare(a: Particle, b: Particle): number;
}
