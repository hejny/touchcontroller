import { Transformation } from './Transformation';
import { BoundingBox } from './BoundingBox';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share';
import { Touch } from './Touch';
export declare class MultiTouch<TElement> {
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
    transformations(boundingBox?: BoundingBox): Observable<Transformation>;
    toString(): string;
}
