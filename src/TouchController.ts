import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { forImmediate } from 'waitasecond';
import { Awaitable } from './interfaces/IAwaitable';
import { IElement } from './interfaces/IElement';
import { IListener } from './interfaces/IListener';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';
import { EventManager } from './utils/EventManager';

// TODO: multitouch should be extended from this
export class TouchController {
    public static fromCanvas(canvas: HTMLCanvasElement) {
        return new TouchController([canvas], canvas, true);
    }

    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;
    public eventManager = new EventManager();

    private touchesObserver: Observer<Touch>;
    private hoveredFramesObserver: Observer<TouchFrame>;
    private listeners: IListener[] = [];

    constructor(
        public elements: IElement[], // TODO: syntax sugar if set only one element
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
            this.addListener(new MouseListener(this.eventManager));
            this.addListener(
                new MouseListener(this.eventManager, [1, 2], true),
            );
            this.addListener(new TouchListener(this.eventManager));
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
            // TODO: Should be here updateEventListener or addEventListener
            this.eventManager.addEventListener(
                element,
                listener.startEventType,
                async (event) => {
                    const newElement = await newElementCreator(event);
                    // this.addElement(newElement);

                    if (
                        !this.elements.some((element) => element === newElement)
                    ) {
                        throw new Error(
                            `When using touchController.addInitialElement you must use touchController.addElement inside the newElementCreator callback.`,
                        );
                    }

                    listener.startFromExternalEvent(newElement, event as any);
                },
            );
        }
    }

    public async emulateTouch(touch: Touch) {
        await forImmediate();
        this.touchesObserver.next(touch);
    }

    private callListenerOnElement(listener: IListener, element: IElement) {
        listener.init(
            element,
            this.anchorElement,
            (touch: Touch) => this.touchesObserver.next(touch),
            (frame: TouchFrame) => {
                if (typeof this.hoveredFramesObserver !== 'undefined') {
                    this.hoveredFramesObserver.next(frame);
                }
            },
        );
        // TODO: array of listeners disposers
    }

    // TODO: method for dispose
}
