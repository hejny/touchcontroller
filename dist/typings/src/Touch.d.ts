import { Observable } from 'rxjs/Observable';
import TimeVector2 from './VectorTouch';
export default class Touch {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    firstPosition: TimeVector2;
    positions: Observable<TimeVector2>;
    private _positionsObserver;
    constructor(id: string, type: 'TOUCH' | 'MOUSE', firstPosition: TimeVector2);
    move(newPoint: TimeVector2, end?: boolean): void;
    readonly start: number;
}
