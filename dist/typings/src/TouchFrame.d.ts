import Vector2 from './Vector2';
export default class TouchFrame {
    element: Element;
    position: Vector2;
    time: number;
    rotating: boolean;
    force: number;
    radius: Vector2;
    constructor(element: Element, position?: Vector2, time?: number, rotating?: boolean, force?: number, radius?: Vector2);
}
