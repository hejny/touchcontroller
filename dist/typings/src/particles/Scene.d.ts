import { Vector2 } from './../Vector2';
import { Particle } from './Particle';
export declare class Scene {
    private ctx;
    particles: Particle[];
    constructor(ctx: CanvasRenderingContext2D);
    addObject(object: Particle): void;
    render(): void;
    update(delta: number): Particle[];
    readonly size: Vector2;
}
