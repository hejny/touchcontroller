import { Subject } from 'rxjs/internal/Subject';
import { IAwaitable } from '../interfaces/IAwaitable';
import { IDestroyable } from '../interfaces/IDestroyable';
import { IElement } from '../interfaces/IElement';
import { IListener } from '../interfaces/IListener';
import { ITouchController } from '../interfaces/ITouchController';
import { MouseListener } from '../listeners/MouseListener';
import { TouchListener } from '../listeners/TouchListener';
import { Destroyable } from '../utils/Destroyable';
import { EventManager } from '../utils/EventManager';
import { WithOptional } from '../utils/WithOptional';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

interface ITouchControllerOptions {
    elements: IElement[];
    anchorElement: HTMLElement;
    setListeners: boolean;
    // TODO: CoorsysLibrary
    // maybe TODO: toggleTouchByTap
}

const touchControllerOptionsDefault = {
    setListeners: true,
};

export class TouchController extends Destroyable implements ITouchController, IDestroyable {
    // TODO: Rename TouchController to Touchcontroller

    public static fromCanvas(canvas: HTMLCanvasElement): TouchController {
        // TODO: fromElement > syntax sugar if set only one element and not only a canvas
        return new TouchController({ elements: [canvas], anchorElement: canvas, setListeners: true });
    }

    // TODO: !!! Use subjects everywhere
    public readonly elements: IElement[];
    public readonly anchorElement: HTMLElement;
    public readonly touches = new Subject<Touch>();
    public readonly hoveredFrames = new Subject<TouchFrame>();
    public readonly eventManager = new EventManager();

    private listeners: IListener<Event>[] = [];

    constructor(options: WithOptional<ITouchControllerOptions, keyof typeof touchControllerOptionsDefault>) {
        super();
        const { elements, anchorElement, setListeners } = {
            ...touchControllerOptionsDefault,
            ...options,
        };

        this.elements = elements;
        this.anchorElement = anchorElement;

        // TODO: document.body vs document in anchorElement and elements
        if (setListeners) {
            this.addListener(new MouseListener(this.eventManager));
            this.addListener(new MouseListener(this.eventManager, [1, 2], true));
            this.addListener(new TouchListener(this.eventManager) as IListener<any>);
        }
    }

    public addListener(listener: IListener<Event>): void {
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

    public addInitialElement(element: IElement, newElementCreator: (event: Event) => IAwaitable<IElement>): void {
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

    private callListenerOnElement(listener: IListener<Event>, element: IElement) {
        listener.init(
            element,
            this.anchorElement,
            (touch: Touch) => this.touches.next(touch),
            (frame: TouchFrame) => this.hoveredFrames.next(frame),
        );
        // TODO: array of listeners disposers
    }

    public async destroy(): Promise<void> {
        super.destroy();
        // TODO: Implement and really destroy things constructed and created here
        // TODO: Use in methods this.checkWhetherNotDestroyed
    }

    // TODO: override destroy and really destroy event listeners created here
    // TODO: detect in methods if I am destroyed
}
