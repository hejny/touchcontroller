import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';

export default class Touche extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {

    private _finished: boolean = false;
    public points: TimeVector2[];

    constructor(public id: string,
                public type: 'TOUCH' | 'MOUSE',
                firstPoint: TimeVector2) {
        super();
        this.points = [firstPoint];
    }

    move(newPoint: TimeVector2, end = false) {
        this.points.push(newPoint);
        if (!end) {
            this.callSubscribers('MOVE', newPoint);
        } else {
            this._finished = true;
            this.callSubscribers('END', newPoint);
        }
    }

    get firstPoint() {
        return this.points[0];
    }

    get start() {
        return this.firstPoint.t;
    }

    get finished() {
        return this._finished;
    }

}