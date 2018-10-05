import { Vector2 } from './../Vector2';
import { IParticleOptions } from './Particle';
export declare class CanvasParticlesRenderer {
    private liveCtx;
    private deadCtx;
    deadParticlesCount: number;
    private scene;
    constructor(quality: Vector2);
    private _contexts;
    addContext(context: CanvasRenderingContext2D): void;
    private _subscribers;
    subscribe(callback: () => void): void;
    private callSubscribers();
    addPoint(options: IParticleOptions): void;
    readonly liveParticlesCount: number;
    private lastRenderNow;
    private render(now);
}