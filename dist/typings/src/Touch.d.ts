import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/range';
import TimeVector2 from './VectorTouch';
export default class Touch {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    firstPosition: TimeVector2;
    uuid: string;
    positions: Observable<TimeVector2>;
    private _positionsObserver;
    lastPosition: TimeVector2;
    constructor(id: string, type: 'TOUCH' | 'MOUSE', firstPosition: TimeVector2);
    move(newPosition: TimeVector2, end?: boolean): void;
    readonly start: number;
    toString(): string;
}
