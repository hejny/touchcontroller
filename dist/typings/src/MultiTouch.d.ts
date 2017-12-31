import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share';
import Touch from './Touch';
export default class MultiTouch<TElement> {
    id: number;
    element: TElement;
    firstTouch: Touch;
    ongoingTouches: Touch[];
    touches: Observable<Touch>;
    private _touchesObserver;
    constructor(id: number, element: TElement, firstTouch: Touch);
    addTouch(touch: Touch): void;
    readonly ongoingTouchesChanges: Observable<Touch[]>;
    readonly ongoingPositionsChanges: Observable<Touch[]>;
    toString(): string;
}
