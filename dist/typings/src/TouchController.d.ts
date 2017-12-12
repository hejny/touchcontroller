import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";
import Touch from './Touch';
import IListener from './listeners/IListener';
export interface IEvent {
    clientX: number;
    clientY: number;
}
export default class TouchController {
    element: HTMLElement;
    observable: Observable<Touch>;
    _observer: Observer<Touch>;
    private _ongoingTouches;
    constructor(element: HTMLElement);
    addListener(listener: IListener): void;
    touchStart(id: string, type: 'TOUCH' | 'MOUSE', event: IEvent): void;
    touchMove(id: string, end: boolean, event: IEvent): void;
    private _createVectorFromEvent(event);
    private _ongoingTouchIndexById(idToFind);
}
