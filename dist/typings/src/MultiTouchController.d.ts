import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Vector2 from './Vector2';
export default class MultiTouchController<TElement> {
    private _touchController;
    private _elementBinder;
    ongoingMultiTouches: MultiTouch<TElement | undefined>[];
    multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private _multiTouchesObserver;
    constructor(_touchController: TouchController, _elementBinder: (position: Vector2) => TElement | undefined);
}
