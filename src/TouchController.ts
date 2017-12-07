import VectorTouch from './VectorTouch';
import Touch from './Touch';
import IListener from './listeners/IListener';
import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';

export interface IEvent {
    clientX: number;
    clientY: number;
}

export default class TouchController extends AbstractClassWithSubscribe<"START" | "MOVE" | "END", Touch> {

    public ongoingTouches: Touch[] = [];

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
        this.ongoingTouches.push(touch);
        this.callSubscribers('START', touch);
    }

    touchMove(id: string, end: boolean, event: IEvent) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            const touch = this.ongoingTouches[index];
            touch.move(this._createVectorFromEvent(event), end);
            if (end) {
                this.ongoingTouches.splice(index, 1);
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
        for (let i = 0; i < this.ongoingTouches.length; i++) {
            const id = this.ongoingTouches[i].id;

            if (id === idToFind) {
                return i;
            }
        }
        return -1;
    }

}