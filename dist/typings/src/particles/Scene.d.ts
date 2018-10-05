import { Vector2 } from './../Vector2';
import { Particle } from './Particle';
export declare class Scene {
    private ctx;
    private friction;
    private objects;
    constructor(ctx: CanvasRenderingContext2D, friction: number);
    addObject(object: Particle): void;
    render(): void;
    update(delta: number): void;
    readonly size: Vector2;
}
