import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import Touch from './Touch';
import IListener from './listeners/IListener';
export interface IEvent {
    clientX: number;
    clientY: number;
}
export default class TouchController {
    element: HTMLElement;
    touches: Observable<Touch>;
    hover: Touch;
    private _touchesAutoIncrement;
    private _touchesObserver;
    private _ongoingTouches;
    constructor(element: HTMLElement);
    addListener(listener: IListener): void;
    touchStart(eventId: string, type: 'TOUCH' | 'MOUSE', event: IEvent): void;
    touchMove(eventId: string, end: boolean, event: IEvent): void;
    hoverMove(event: IEvent): void;
    private _createVectorFromEvent(event);
    private _ongoingTouchIndexById(eventIdToFind);
}
