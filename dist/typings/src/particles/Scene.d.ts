import { Vector2 } from './../Vector2';
import { Particle } from './Particle';
export declare class Scene {
    private ctx;
    private friction;
    private particles;
    constructor(ctx: CanvasRenderingContext2D, friction: number);
    addObject(object: Particle): void;
    render(): void;
    update(delta: number): Particle[];
    readonly size: Vector2;
}
