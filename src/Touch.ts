import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';

export default class Touche extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {

    private _finished: boolean = false;
    public positions: TimeVector2[];

    constructor(public id: string,
                public type: 'TOUCH' | 'MOUSE',
                firstPosition: TimeVector2) {
        super();
        this.positions = [firstPosition];
    }

    move(newPoint: TimeVector2, end = false) {
        this.positions.push(newPoint);
        if (!end) {
            this.callSubscribers('MOVE', newPoint);
        } else {
            this._finished = true;
            this.callSubscribers('END', newPoint);
        }
    }

    get firstPosition() {
        return this.positions[0];
    }

    get start() {
        return this.firstPosition.t;
    }

    get finished() {
        return this._finished;
    }

}