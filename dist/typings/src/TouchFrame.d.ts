import Vector2 from './Vector2';
export default class TouchFrame {
    position: Vector2;
    time: number;
    rotating: boolean;
    force: number;
    radius: Vector2;
    constructor(position?: Vector2, time?: number, rotating?: boolean, force?: number, radius?: Vector2);
}
