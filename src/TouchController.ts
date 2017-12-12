import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import VectorTouch from './VectorTouch';
import Touch from './Touch';
import IListener from './listeners/IListener';

//todo touch event
export interface IEvent {
    clientX: number;
    clientY: number;
}

export default class TouchController{

    public touches: Observable<Touch>;
    private _touchesObserver: Observer<Touch>;
    private _ongoingTouches: Touch[] = [];

    constructor(public element: HTMLElement) {
        this.touches = Observable.create((observer:Observer<Touch>)=>{
            this._touchesObserver = observer;
        });
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
        this._touchesObserver.next(touch);
    }

    touchMove(id: string, end: boolean, event: IEvent) {
        const index = this._ongoingTouchIndexById(id);
        if (index !== -1) {
            const touch = this._ongoingTouches[index];
            touch.move(this._createVectorFromEvent(event), end);
            if (end) {
                this._ongoingTouches.splice(index, 1);
                //this.callSubscribers('END', touch);
            } else {
                //this.callSubscribers('MOVE', touch);
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