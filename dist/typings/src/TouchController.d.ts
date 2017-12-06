import Touch from './Touch';
import IListener from './listeners/IListener';
import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
export default class TouchController extends AbstractClassWithSubscribe<"START" | "MOVE" | "END", Touch> {
    element: HTMLElement;
    ongoingTouches: Touch[];
    constructor(element: HTMLElement);
    addListener(listener: IListener): void;
    touchStart(touch: Touch): void;
    touchMove(id: string, end: boolean, event: {
        clientX: number;
        clientY: number;
    }): void;
    private _ongoingTouchIndexById(idToFind);
}
