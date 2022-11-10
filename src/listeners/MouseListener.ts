import { Vector } from 'xyzt';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../touch/Touch';
import { TouchFrame } from '../touch/TouchFrame';
import { EventManager } from '../utils/EventManager';
import { getBoundingClientRectEnhanced } from '../utils/getBoundingClientRectEnhanced';
import { IElement } from './../interfaces/IElement';
import { SourceCache } from './../utils/Cache';

const MOUSE_LISTENER_OPTIONS = {
    capture: true,
    passive: false,
};

// TODO: remove singleton
let onlyTouch: Touch | null = null;

export class MouseListener implements IListener<MouseEvent> {
    public get title(): string {
        return `MOUSE(${this.buttons.join(',')})`;
    }
    public startEventType = 'mousedown';

    private elements = new SourceCache<
        IElement,
        {
            handleMouseDownOnElement: IHandleMouseDownOnElement;
        }
    >();

    constructor(
        private readonly eventManager: EventManager,
        private readonly buttons: number[] = [0],
        private readonly rotating = false,
    ) {}

    public acceptsEvent(event: Event): event is MouseEvent {
        if (!(event instanceof MouseEvent)) return false;
        return this.buttons.indexOf((event as MouseEvent).button) !== -1;
    }

    public init(
        element: IElement,
        anchorElement: IElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ): void {
        if (this.elements.hasItem(element)) {
            throw new Error('Element should not be already initialized when using init.');
        }

        this.eventManager.addEventListener(
            element,
            'mousedown',
            (event) => handleMouseDownOnElement(event as any),
            MOUSE_LISTENER_OPTIONS,
        );

        this.eventManager.addEventListener(
            element,
            'mousemove',
            (event) => handleMouseMoveOnElement(event as any),
            MOUSE_LISTENER_OPTIONS,
        );

        // TODO: configurable mouse buttons
        this.eventManager.addEventListener(
            element,
            'contextmenu',
            (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
            false,
        );

        let currentTouch: Touch | null = null;

        const handleMouseDownOnElement: IHandleMouseDownOnElement = (event: MouseEvent) => {
            if (!this.acceptsEvent(event)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            handleStart(event);
        };

        const handleStart = async (event: MouseEvent) => {
            if (onlyTouch) {
                onlyTouch.frames.complete();
            }

            console.log('!!! Mouse');

            currentTouch = new Touch({
                type: 'MOUSE',
                anchorElement,
                buttonIdentifier: event.buttons /* TODO: Is a good option to cast button to identifier? */,
                firstFrame: createTouchFrameFromEvent(event),
            });

            this.eventManager.addEventListener(
                document,
                'mousemove',
                handleMouseMoveOnDocument,
                MOUSE_LISTENER_OPTIONS,
            );

            const mouseUpListenerOnDocument = () => {
                if (currentTouch) {
                    currentTouch.frames.complete();
                    currentTouch = null;
                }

                document.removeEventListener('mousemove', handleMouseMoveOnDocument);

                document.removeEventListener('mouseup', mouseUpListenerOnDocument);
            };

            this.eventManager.addEventListener(document, 'mouseup', mouseUpListenerOnDocument, MOUSE_LISTENER_OPTIONS);

            newTouch(currentTouch);
            onlyTouch = currentTouch;

            //  !!! test and Remove> currentTouch.frames.next(createTouchFrameFromEvent(event));
        };

        // TODO: Why is there is after first mouse click triggered handleMouseMoveOnElement and after mouse up handleMouseMoveOnDocument?

        const handleMouseMoveOnDocument = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (currentTouch) {
                currentTouch.frames.next(createTouchFrameFromEvent(event));
            }

            // TODO: DRY
            if (event.buttons <= 0) {
                if (!currentTouch) {
                    newHoverFrame(createTouchFrameFromEvent(event));
                }
            }
        };

        const handleMouseMoveOnElement = (event: MouseEvent) => {
            // console.log('handleMouseMoveOnElement');
            if (event.buttons <= 0) {
                if (!currentTouch) {
                    newHoverFrame(createTouchFrameFromEvent(event));
                }
            }
        };

        const createTouchFrameFromEvent = (event: MouseEvent) => {
            const boundingRect = getBoundingClientRectEnhanced(element);
            return new TouchFrame({
                element,
                anchorElement,
                positionRelative: Vector.fromArray(event.clientX - boundingRect.left, event.clientY - boundingRect.top),
                rotating: this.rotating,
            });
        };

        this.elements.setItem(element, {
            handleMouseDownOnElement,
        });
    }

    public async startFromExternalEvent(element: IElement, event: Event): Promise<void> {
        const item = this.elements.getItem(element);
        if (!item) {
            throw new Error('Element should be initialized when using startFromExternalEvent.');
        }
        const { handleMouseDownOnElement } = item;

        // TODO: Maybe
        // event.preventDefault();
        // event.stopPropagation();

        handleMouseDownOnElement(event as MouseEvent);
    }
}

type IHandleMouseDownOnElement = (event: MouseEvent) => void;
