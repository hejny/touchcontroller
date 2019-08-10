import { IElement } from './../interfaces/IElement';
import { SourceCache } from './../utils/Cache';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../Touch';
import { Vector2 } from '../Vector2';
import { IEvent } from '../interfaces/IEvent';
import { TouchFrame } from '../TouchFrame';

const MOUSE_LISTENER_OPTIONS = {
    capture: true,
    passive: false,
};

// TODO: remove singleton
let onlyTouch: Touch | null = null;

export class MouseListener implements IListener {
    constructor(private buttons: number[] = [0], private rotating = false) {}

    public get title() {
        return `MOUSE(${this.buttons.join(',')})`;
    }
    public startEventType = `mousedown`;

    public async startFromExternalEvent(element: IElement, event: IEvent) {
        const item = this.elements.getItem(element);
        if (!item) {
            throw new Error(
                `Element should be initialized when using startFromExternalEvent.`,
            );
        }
        const { handleStart, createTouchFrameFromEvent } = item;

        handleStart(createTouchFrameFromEvent(event));
    }

    private elements = new SourceCache<
        IElement,
        {
            createTouchFrameFromEvent: ICreateTouchFrameFromEvent;
            handleStart: IHandleStart;
        }
    >();

    public init(
        element: IElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ) {
        if (this.elements.hasItem(element)) {
            throw new Error(
                `Element should not be initialized when using init.`,
            );
        }

        element.addEventListener(
            'mousedown',
            (event) => handleMouseDownOnElement(event as any),
            MOUSE_LISTENER_OPTIONS,
        );

        element.addEventListener(
            'mousemove',
            (event) => handleMouseMoveOnElement(event as any),
            MOUSE_LISTENER_OPTIONS,
        );

        // TODO: configurable mouse buttons
        element.addEventListener(
            'contextmenu',
            (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
            false,
        );

        let currentTouch: Touch | null = null;

        const handleMouseDownOnElement = (event: MouseEvent) => {
            if (this.buttons.indexOf(event.button) !== -1) {
                event.preventDefault();
                event.stopPropagation();
                handleStart(createTouchFrameFromEvent(event));
            }
        };

        const handleStart: IHandleStart = (firstTouchFrame: TouchFrame) => {
            if (onlyTouch) {
                onlyTouch.end();
            }

            currentTouch = new Touch('MOUSE', anchorElement, firstTouchFrame);

            document.addEventListener(
                'mousemove',
                handleMouseMoveOnDocument,
                MOUSE_LISTENER_OPTIONS,
            );

            const mouseUpListenerOnDocument = () => {
                // console.log('mouseup');

                if (currentTouch) {
                    currentTouch.end();
                    currentTouch = null;
                }

                document.removeEventListener(
                    'mousemove',
                    handleMouseMoveOnDocument,
                );

                document.removeEventListener(
                    'mouseup',
                    mouseUpListenerOnDocument,
                );
            };

            document.addEventListener(
                'mouseup',
                mouseUpListenerOnDocument,
                MOUSE_LISTENER_OPTIONS,
            );

            newTouch(currentTouch);
            onlyTouch = currentTouch;
        };

        const handleMouseMoveOnDocument = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (currentTouch) {
                currentTouch.move(createTouchFrameFromEvent(event), false);
            }
        };

        const handleMouseMoveOnElement = (event: MouseEvent) => {
            if (event.buttons <= 0) {
                if (!currentTouch) {
                    newHoverFrame(createTouchFrameFromEvent(event));
                }
            }
        };

        const createTouchFrameFromEvent: ICreateTouchFrameFromEvent = (
            event: IEvent,
        ) => {
            const boundingRect = element.getBoundingClientRect();
            return new TouchFrame(
                element,
                anchorElement,
                new Vector2(
                    event.clientX - boundingRect.left,
                    event.clientY - boundingRect.top,
                ),
                performance.now(),
                this.rotating,
            );
        };

        this.elements.setItem(element, {
            handleStart,
            createTouchFrameFromEvent,
        });
    }
}

type ICreateTouchFrameFromEvent = (event: IEvent) => TouchFrame;
type IHandleStart = (firstTouchFrame: TouchFrame) => void;
