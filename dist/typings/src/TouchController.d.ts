import { Observable } from 'rxjs/Observable';
import Touch from './Touch';
import IListener from './listeners/IListener';
export interface IEvent {
    clientX: number;
    clientY: number;
}
export default class TouchController {
    element: HTMLElement;
    touches: Observable<Touch>;
    private _touchesObserver;
    private _ongoingTouches;
    constructor(element: HTMLElement);
    addListener(listener: IListener): void;
    touchStart(id: string, type: 'TOUCH' | 'MOUSE', event: IEvent): void;
    touchMove(id: string, end: boolean, event: IEvent): void;
    private _createVectorFromEvent(event);
    private _ongoingTouchIndexById(idToFind);
}
