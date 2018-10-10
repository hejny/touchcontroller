import { TouchFrame } from './TouchFrame';
import { MultiTouch } from './MultiTouch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { TouchController } from './TouchController';
export declare class MultiTouchController<TElement> {
    touchController: TouchController;
    private _elementBinder;
    ongoingMultiTouches: MultiTouch<TElement | undefined>[];
    multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private _multiTouchesObserver;
    constructor(touchController: TouchController, _elementBinder: (frame: TouchFrame) => TElement | undefined);
    readonly hoveredElements: Observable<TElement | undefined>;
    readonly hoveredElementsChanges: Observable<[TElement | undefined, TElement | undefined]>;
}
