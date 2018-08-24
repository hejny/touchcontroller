import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import Touch from './Touch';
import TouchFrame from './TouchFrame';
import IListener from './listeners/IListener';
export default class TouchController {
    elements: HTMLElement[];
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    private _touchesObserver;
    private _hoveredFramesObserver;
    constructor(elements: HTMLElement[], setListeners?: boolean);
    addListener(listener: IListener): void;
    emulateTouch(touch: Touch): void;
}
