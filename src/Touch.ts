import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';

export default class Touche extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {

    private _finished: boolean = false;

    constructor(public id: string,
                public type: 'TOUCH' | 'MOUSE',
                public points: TimeVector2[] = []) {
        super();
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

    get start() {
        return this.points[0].t;
    }

    get finished() {
        return this._finished;
    }

}