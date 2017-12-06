import Vector2 from './Vector2';
import TouchController from './TouchController';
export default class VectorTouch extends Vector2 {
    private _touchController;
    t: number;
    constructor(_touchController: TouchController, x: number, y: number, t: number);
    to1(): Vector2;
}
