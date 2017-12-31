import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Touch from './Touch';
import Vector2 from './Vector2';
export default class MultiTouchController<TElement> {
    private _touchController;
    private _elementBinder;
    ongoingMultiTouches: MultiTouch<TElement>[];
    multiTouches: Observable<MultiTouch<TElement>>;
    private _multiTouchesAutoIncrement;
    private _multiTouchesObserver;
    unknownTouches: Observable<Touch>;
    private _unknownTouchesObserver;
    constructor(_touchController: TouchController, _elementBinder: (position: Vector2) => TElement | undefined);
}
