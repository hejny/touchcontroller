import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import TimeVector2 from './VectorTouch';
export default class Touch {
    id: number;
    eventId: string;
    type: 'TOUCH' | 'MOUSE';
    firstPosition: TimeVector2;
    positions: Observable<TimeVector2>;
    private _positionsObserver;
    lastPosition: TimeVector2;
    constructor(id: number, eventId: string, type: 'TOUCH' | 'MOUSE', firstPosition: TimeVector2);
    move(newPosition: TimeVector2, end?: boolean): void;
    readonly start: number;
    toString(): string;
}
