import { Subject } from 'rxjs/internal/Subject';
import { Awaitable } from '../interfaces/Awaitable';
import { IElement } from '../interfaces/IElement';
import { IListener } from '../interfaces/IListener';
import { ITouchController } from '../interfaces/ITouchController';
import { MouseListener } from '../listeners/MouseListener';
import { TouchListener } from '../listeners/TouchListener';
import { EventManager } from '../utils/EventManager';
import { WithOptional } from '../utils/WithOptional';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

type ITouchControllerOptions = (
    | { elements: IElement[]; anchorElement: HTMLElement }
    | { element: IElement; createEventCapturingElement?: boolean }
) & {
    // Note: Here I am not using WithOptional heplper so I need to put ? before optional options
    setListeners?: boolean;
    // TODO: CoorsysLibrary
    // maybe TODO: toggleTouchByTap
};

const touchControllerOptionsDefault = {
    setListeners: true,
};

export class TouchController implements ITouchController {
    // TODO: Rename TouchController to Touchcontroller

    public readonly elements: IElement[];
    public readonly anchorElement: HTMLElement;
    public readonly touches = new Subject<Touch>();
    public readonly hoveredFrames = new Subject<TouchFrame>();
    public readonly eventManager = new EventManager();

    private listeners: IListener[] = [];

    constructor(options: ITouchControllerOptions) {
        const { element, elements, anchorElement, setListeners } = {
            ...touchControllerOptionsDefault,
            ...options,
        };

        // TODO: !!! createEventCapturingElement

        if (element) {
            this.elements = [element];
            this.anchorElement = element as HTMLElement;
        } else if (elements && anchorElement) {
            this.elements = elements;
            this.anchorElement = anchorElement;
        } else {
            throw new Error('There must be set element or elements+anchorElement when costructing TouchController.');
        }

        // TODO: document.body vs document in anchorElement and elements
        if (setListeners) {
            this.addListener(new MouseListener(this.eventManager));
            this.addListener(new MouseListener(this.eventManager, [1, 2], true));
            this.addListener(new TouchListener(this.eventManager));
        }
    }

    public addListener(listener: IListener): void {
        this.listeners.push(listener);
        for (const element of this.elements) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addElement(element: IElement): void {
        this.elements.push(element);

        for (const listener of this.listeners) {
            this.callListenerOnElement(listener, element);
        }
    }

    public addInitialElement(element: IElement, newElementCreator: (event: Event) => Awaitable<IElement>): void {
        for (const listener of this.listeners) {
            // TODO: Should be here updateEventListener or addEventListener
            this.eventManager.addEventListener(element, listener.startEventType, async (event) => {
                if (!listener.acceptsEvent(event)) {
                    return;
                }

                const newElement = await newElementCreator(event);
                // this.addElement(newElement);

                if (!this.elements.some((elementx) => elementx === newElement)) {
                    throw new Error(
                        'When using touchController.addInitialElement you must use touchController.addElement inside the newElementCreator callback.',
                    );
                }

                listener.startFromExternalEvent(newElement, event as any);
            });
        }
    }

    /*
    TODO: Delete (should be in each touchframe)
    public instance(): TouchController {
        const touchController = new TouchController(this.elements, this.anchorElement, false);
        this.touches();
        return touchController;
    }

     TODO: Delete (should be in each touchframe)
    public applyGrid(grid: () => ITransform): TouchController {
        return new TouchController(this.elements, this.anchorElement, false);
    }
    */

    /*
    TODO:
     TODO: Delete (should be in each touchframe)
    public applyGrid(grid: Grid): GridTouchController {
        return grid.applyToTouchController(this);
    }
    */

    private callListenerOnElement(listener: IListener, element: IElement) {
        listener.init(
            element,
            this.anchorElement,
            (touch: Touch) => this.touches.next(touch),
            (frame: TouchFrame) => this.hoveredFrames.next(frame),
        );
        // TODO: array of listeners disposers
    }

    // TODO: method for dispose
}
