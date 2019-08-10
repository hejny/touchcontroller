import { IElement } from './interfaces/IElement';
import { Awaitable } from './interfaces/IAwaitable';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { forImmediate } from 'waitasecond';
import { IListener } from './interfaces/IListener';
import { MouseListener } from './listeners/MouseListener';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

// TODO: multitouch should be extended from this
export class TouchController {
    public static fromCanvas(canvas: HTMLCanvasElement) {
        return new TouchController([canvas], canvas, true);
    }

    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;

    private touchesObserver: Observer<Touch>;
    private hoveredFramesObserver: Observer<TouchFrame>;
    private listeners: IListener[] = [];

    constructor(
        public elements: Array<IElement>, // TODO: syntax sugar if set only one element
        public anchorElement: HTMLElement,
        setListeners = true,
    ) {
        // TODO: HTMLElement vs Element
        this.touches = Observable.create((observer: Observer<Touch>) => {
            this.touchesObserver = observer;
        }).share();

        this.hoveredFrames = Observable.create(
            (observer: Observer<TouchFrame>) => {
                this.hoveredFramesObserver = observer;
            },
        ).share();

        if (setListeners) {
            this.addListener(new MouseListener());
            this.addListener(new MouseListener([1, 2], true));
            // TODO: this.addListener(createTouchListener());
        }
    }

    public addListener(listener: IListener) {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addElement(element: IElement) {
        this.elements.push(element);

        for (const listener of this.listeners) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addInitialElement(
        element: IElement,
        newElementCreator: (event: Event) => Awaitable<IElement>,
    ) {
        for (const listener of this.listeners) {
            console.log(listener);
            element.addEventListener(listener.startEventType, async (event) => {
                const newElement = await newElementCreator(event);
                this.addElement(newElement);
                listener.startFromExternalEvent(newElement, event as any);

                // TODO: !!! Call immediate listener here
            });
        }
    }

    public async emulateTouch(touch: Touch) {
        await forImmediate();
        this.touchesObserver.next(touch);
    }

    private callListenerOnElement(
        listener: IListener,
        element: IElement,
        //immediateDrag: null | Event,
    ) {
        listener.init(
            element,
            this.anchorElement,
            (touch: Touch) => this.touchesObserver.next(touch),
            (frame: TouchFrame) => {
                if (typeof this.hoveredFramesObserver !== 'undefined') {
                    this.hoveredFramesObserver.next(frame);
                }
            },
            //immediateDrag,
        );
        // TODO: array of listeners disposers
    }

    // TODO: method for dispose
}
