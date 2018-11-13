import { Vector2 } from './Vector2';
export declare class TouchFrame {
    element: HTMLElement | SVGElement;
    anchorElement: HTMLElement;
    positionRelative: Vector2;
    time: number;
    rotating: boolean;
    force: number;
    radius: Vector2;
    position: Vector2;
    constructor(element: HTMLElement | SVGElement, anchorElement: HTMLElement, positionRelative?: Vector2, time?: number, rotating?: boolean, force?: number, radius?: Vector2);
    clone(): TouchFrame;
}
