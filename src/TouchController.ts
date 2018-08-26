import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { Observer } from 'rxjs/Observer';
import Touch from './Touch';
import TouchFrame from './TouchFrame';
import IListener from './listeners/IListener';
import * as listeners from './listeners/';

//todo multitouch should be extended from this
export default class TouchController {
    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;
    //private _touchesAutoIncrement: number = 0;
    private _touchesObserver: Observer<Touch>;
    private _hoveredFramesObserver: Observer<TouchFrame>;
    //private _ongoingTouches: Touch[] = [];

    static fromCanvas(canvas: HTMLCanvasElement){
        return new TouchController([canvas],canvas,true);
    }

    constructor(
        public elements: HTMLElement[],//todo syntax sugar if set only one element
        public anchorElement: HTMLElement,
        setListeners = true,
    ) {
        //todo HTMLElement vs Element
        this.touches = Observable.create((observer: Observer<Touch>) => {
            this._touchesObserver = observer;
        }).share();

        this.hoveredFrames = Observable.create(
            (observer: Observer<TouchFrame>) => {
                this._hoveredFramesObserver = observer;
            },
        ).share();

        if (setListeners) {
            this.addListener(listeners.createMouseListener());
            this.addListener(listeners.createMouseListener([1, 2], true));
            this.addListener(listeners.createTouchListener());
            //this.addListener(listeners.createMouseScaleListener());
        }
    }

    //todo dispose

    addListener(listener: IListener) {
        for (const element of this.elements) {
            listener(
                element,
                this.anchorElement,
                (touch: Touch) => this._touchesObserver.next(touch),
                (frame: TouchFrame) => {
                    if (typeof this._hoveredFramesObserver !== 'undefined') {
                        this._hoveredFramesObserver.next(frame);
                    }
                },
            );
            //todo array of listeners disposers
        }
    }

    emulateTouch(touch: Touch) {
        setImmediate(() => {
            this._touchesObserver.next(touch);
        });
    }

    /*touchStart(eventId: string, type: 'TOUCH' | 'MOUSE', event: IEvent) {
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
            new Vector2(
                event.clientX - this.element.offsetLeft,
                event.clientY - this.element.offsetTop
            ),
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
    */

    //todo dispose
}
