import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share';
import Touch from './Touch';
import Transformation from './Transformation';
export default class MultiTouch<TElement> {
    element: TElement;
    firstTouch: Touch;
    empty: boolean;
    ongoingTouches: Touch[];
    touches: Observable<Touch>;
    private _touchesObserver;
    constructor(element: TElement, firstTouch: Touch);
    addTouch(touch: Touch): void;
    readonly ongoingTouchesChanges: Observable<Touch[]>;
    readonly ongoingPositionsChanges: Observable<Touch[]>;
    transformations(objectTransformation?: Transformation): Observable<Transformation>;
    toString(): string;
}
