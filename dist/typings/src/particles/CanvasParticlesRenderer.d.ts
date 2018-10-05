import { Vector2 } from './../Vector2';
export declare class CanvasParticlesRenderer {
    private liveCtx;
    private deadCtx;
    private scene;
    constructor(quality: Vector2);
    private _contexts;
    addContext(context: CanvasRenderingContext2D): void;
    private _subscribers;
    subscribe(callback: () => void): void;
    private callSubscribers();
    addPoint(position: Vector2): void;
    private lastRenderNow;
    private render(now);
}
