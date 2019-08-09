import { Awaitable } from './interfaces/IAwaitable';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { forImmediate } from 'waitasecond';
import { IListener } from './interfaces/IListener';
import { createMouseListener } from './listeners/createMouseListener';
import { createTouchListener } from './listeners/createTouchListener';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';
import { IEvent } from '../dist/interfaces/IEvent';

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
        public elements: Array<HTMLElement | SVGElement>, // TODO: syntax sugar if set only one element
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
            this.addListener(createMouseListener());
            this.addListener(createMouseListener([1, 2], true));
            this.addListener(createTouchListener());
        }
    }

    private get listenersInitialEventType(): string[] {
        return this.listeners.map((listener) => listener.initialEventType);
    }

    public addListener(listener: IListener) {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener, element, null);
        }
    }

    public addElement(
        element: HTMLElement | SVGElement,
        //immediateDrag: null | Event = null,
    ) {
        this.elements.push(element);

        // let someListenerAcceptedImmediateDrag = false;

        for (const listener of this.listeners) {
            // TODO: Check if the event is correct
            if (immediateDrag /* && listener.acceptsEvent(immediateDrag)*/) {
                // console.log(immediateDrag);
                // console.log(listener.title);
                this.callListenerOnElement(listener, element, immediateDrag);
                // someListenerAcceptedImmediateDrag = true;
                // immediateDrag = null;// TODO: maybe create helper var dragging.
            } else {
                this.callListenerOnElement(listener, element, null);
            }
        }

        /*console.log(someListenerAcceptedImmediateDrag);

        if(immediateDrag && !someListenerAcceptedImmediateDrag){
            console.warn(`Any of listeners ${this.listeners.map(listener=>listener.title).join(', ')} not accepted event on immediate drag, probbably thare is some browser incompatibility.`,immediateDrag);
        }*/
    }

    public addInitialElement(element: HTMLElement|SVGElement, newElementCreator: (event: Event)=>Awaitable<HTMLElement|SVGElement>){

        for(const initialEventType of this.listenersInitialEventType){
            element.addEventListener(initialEventType,async (event)=>{
    
    
                const newElement = await newElementCreator(event);
                this.addElement(newElement);
                
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
        element: HTMLElement | SVGElement,
        immediateDrag: null | Event,
    ) {
        listener(
            element,
            this.anchorElement,
            (touch: Touch) => this.touchesObserver.next(touch),
            (frame: TouchFrame) => {
                if (typeof this.hoveredFramesObserver !== 'undefined') {
                    this.hoveredFramesObserver.next(frame);
                }
            },
            immediateDrag,
        );
        // TODO: array of listeners disposers
    }

    // TODO: method for dispose
}
