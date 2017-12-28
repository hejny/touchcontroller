import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share'
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
    public hover: Touch;
    private _touchesAutoIncrement: number = 0;
    private _touchesObserver: Observer<Touch>;
    private _ongoingTouches: Touch[] = [];

    constructor(public element: HTMLElement) {
        this.hover = new Touch(
            this,
            this._touchesAutoIncrement++,
            'hover',//todo this should be external ID
            'MOUSE',
            new VectorTouch(
                this,
                0,
                0,
                performance.now()
            )//todo better
        );
        this.touches = Observable.create((observer:Observer<Touch>)=>{
            this._touchesObserver = observer;
        }).share();
    }

    //todo dispose

    addListener(listener: IListener) {
        listener.setListeners(this);//todo array of listeners
    }

    touchStart(eventId: string, type: 'TOUCH' | 'MOUSE', event: IEvent) {
        const touch = new Touch(
            this,
            this._touchesAutoIncrement++,
            eventId,
            type,
            this._createVectorFromEvent(event)
        );
        this._ongoingTouches.push(touch);
        this._touchesObserver.next(touch);
    }

    touchMove(eventId: string, end: boolean, event: IEvent) {
        const index = this._ongoingTouchIndexById(eventId);
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
            this.hoverMove(event);
        }
    }

    hoverMove(event: IEvent) {
        this.hover.move(this._createVectorFromEvent(event));
    }

    private _createVectorFromEvent(event: IEvent) {
        return new VectorTouch(
            this,
            event.clientX - this.element.offsetLeft,
            event.clientY - this.element.offsetTop,
            performance.now()
        );
    }

    private _ongoingTouchIndexById(eventIdToFind: string): number {
        for (let i = 0; i < this._ongoingTouches.length; i++) {
            const eventId = this._ongoingTouches[i].eventId;

            if (eventId === eventIdToFind) {
                return i;
            }
        }
        return -1;
    }

}