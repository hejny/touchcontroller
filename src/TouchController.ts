import VectorTouch from './VectorTouch';
import Touch from './Touch';
import IListener from './listeners/IListener';
import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';

//todo touch event
export interface IEvent {
    clientX: number;
    clientY: number;
}

//todo maybe remove end and move listener
export default class TouchController extends AbstractClassWithSubscribe<"START" | "MOVE" | "END", Touch> {

    private _ongoingTouches: Touch[] = [];

    constructor(public element: HTMLElement) {
        super();
    }

    //todo dispose

    addListener(listener: IListener) {
        listener.setListeners(this);//todo array of listeners
    }

    touchStart(id: string, type: 'TOUCH' | 'MOUSE', event: IEvent) {
        const touch = new Touch(
            id,
            type,
            this._createVectorFromEvent(event)
        );
        this._ongoingTouches.push(touch);
        this.callSubscribers('START', touch);
    }

    touchMove(id: string, end: boolean, event: IEvent) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            const touch = this._ongoingTouches[index];
            touch.move(this._createVectorFromEvent(event), end);
            if (end) {
                this._ongoingTouches.splice(index, 1);
                this.callSubscribers('END', touch);
            } else {
                this.callSubscribers('MOVE', touch);
            }
        } else {
            //console.warn(`Can't find touch with id "${id}".`);
        }
    }

    private _createVectorFromEvent(event: IEvent) {
        return new VectorTouch(
            this,
            event.clientX - this.element.offsetLeft,
            event.clientY - this.element.offsetTop,
            performance.now()
        );
    }

    private _ongoingTouchIndexById(idToFind: string): number {
        for (let i = 0; i < this._ongoingTouches.length; i++) {
            const id = this._ongoingTouches[i].id;

            if (id === idToFind) {
                return i;
            }
        }
        return -1;
    }

}