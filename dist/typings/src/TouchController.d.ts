import Touch from './Touch';
import IListener from './listeners/IListener';
import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
export interface IEvent {
    clientX: number;
    clientY: number;
}
export default class TouchController extends AbstractClassWithSubscribe<"START" | "MOVE" | "END", Touch> {
    element: HTMLElement;
    ongoingTouches: Touch[];
    constructor(element: HTMLElement);
    addListener(listener: IListener): void;
    touchStart(id: string, type: 'TOUCH' | 'MOUSE', event: IEvent): void;
    touchMove(id: string, end: boolean, event: IEvent): void;
    private _createVectorFromEvent(event);
    private _ongoingTouchIndexById(idToFind);
}
