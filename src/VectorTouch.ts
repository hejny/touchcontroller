import Vector2 from './Vector2';
import TouchController from './TouchController';

export default class VectorTouch extends Vector2 {
    constructor(private _touchController: TouchController,
                x: number,
                y: number,
                public t: number) {
        super(x, y);
    }

    to1(): Vector2 {
        return new Vector2(
            this.x / this._touchController.element.clientWidth,
            this.y / this._touchController.element.clientHeight
        );
    }
}