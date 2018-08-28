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
    private _touchesObserver: Observer<Touch>;
    private _hoveredFramesObserver: Observer<TouchFrame>;

    static fromCanvas(canvas: HTMLCanvasElement) {
        return new TouchController([canvas], canvas, true);
    }

    constructor(
        public elements: HTMLElement[], //todo syntax sugar if set only one element
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
        }
    }

    private listeners: IListener[] = [];

    addListener(listener: IListener) {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener,element);
        }
    }

    addElement(element: HTMLElement) {
        this.elements.push(element);
        for (const listener of this.listeners) {
            this.callListenerOnElement(listener,element);
        }
    }

    callListenerOnElement(listener:IListener, element: HTMLElement){
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


    emulateTouch(touch: Touch) {
        setImmediate(() => {
            this._touchesObserver.next(touch);
        });
    }

    //todo method for dispose
}
