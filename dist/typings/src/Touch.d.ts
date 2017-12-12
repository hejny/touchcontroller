import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";
import TimeVector2 from './VectorTouch';
export default class Touch {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    observable: Observable<TimeVector2>;
    _observer: Observer<TimeVector2>;
    private _finished;
    positions: TimeVector2[];
    constructor(id: string, type: 'TOUCH' | 'MOUSE', firstPosition: TimeVector2);
    move(newPoint: TimeVector2, end?: boolean): void;
    readonly firstPosition: TimeVector2;
    readonly start: number;
    readonly finished: boolean;
}
