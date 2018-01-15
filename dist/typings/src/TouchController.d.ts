import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import Touch from './Touch';
import IListener from './listeners/IListener';
export default class TouchController {
    element: HTMLElement;
    touches: Observable<Touch>;
    private _touchesObserver;
    constructor(element: HTMLElement, setListeners?: boolean);
    addListener(listener: IListener): void;
    emulateTouch(touch: Touch): void;
}
