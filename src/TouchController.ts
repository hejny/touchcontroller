// TODO: import window from '@heduapp/fake-window';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { IListener } from './interfaces/IListener';
import { createMouseListener } from './listeners/createMouseListener';
import { createTouchListener } from './listeners/createTouchListener';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';
import { forValueDefined, forImmediate } from 'waitasecond';

//todo multitouch should be extended from this
export class TouchController {
    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;
    private _touchesObserver?: Observer<Touch>;
    private _hoveredFramesObserver?: Observer<TouchFrame>;

    static fromCanvas(canvas: HTMLCanvasElement) {
        return new TouchController([canvas], canvas, true);
    }

    constructor(
        public elements: (HTMLElement | SVGElement)[], //todo syntax sugar if set only one element
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
            this.addListener(createMouseListener());
            this.addListener(createMouseListener([1, 2], true));
            this.addListener(createTouchListener());
        }
    }

    private listeners: IListener[] = [];

    addListener(listener: IListener) {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener, element, null);
        }
    }

    addElement(
        element: HTMLElement | SVGElement,
        immediateDrag: null | Event = null,
    ) {
        this.elements.push(element);
        for (const listener of this.listeners) {
            if (immediateDrag && listener.acceptsEvent(immediateDrag)) {
                this.callListenerOnElement(listener, element, immediateDrag);
                //immediateDrag = null;//todo maybe create helper var dragging.
            } else {
                this.callListenerOnElement(listener, element, null);
            }
        }
    }

    private callListenerOnElement(
        listener: IListener,
        element: HTMLElement | SVGElement,
        immediateDrag: null | Event,
    ) {
        listener(
            element,
            this.anchorElement,
            async (touch: Touch) => (await forValueDefined(()=>this._touchesObserver)).next(touch),
            (frame: TouchFrame) => {
                if (typeof this._hoveredFramesObserver !== 'undefined') {
                    this._hoveredFramesObserver.next(frame);
                }
            },
            immediateDrag,
        );
        //todo array of listeners disposers
    }

    async emulateTouch(touch: Touch) {
        await forImmediate();
        (await forValueDefined(()=>this._touchesObserver)).next(touch);      
    }

    //todo method for dispose
}
