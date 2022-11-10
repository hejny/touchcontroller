import { forAnimationFrame } from 'waitasecond';
import { Vector } from 'xyzt';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../touch/Touch';
import { TouchFrame } from '../touch/TouchFrame';
import { DomTouch } from '../utils/DomTouch';
import { getBoundingClientRectEnhanced } from '../utils/getBoundingClientRectEnhanced';
import { IElement } from './../interfaces/IElement';
import { SourceCache } from './../utils/Cache';
import { EventManager } from './../utils/EventManager';

const TOUCH_LISTENER_OPTIONS = {
    capture: true,
    passive: false,
};

export class TouchListener implements IListener<TouchEvent> {
    public get title(): string {
        return 'TOUCH';
    }
    public startEventType = 'touchstart';

    private elements = new SourceCache<
        IElement,
        {
            anchorElement: IElement;
            createTouchFrameFromEvent: ICreateTouchFrameFromTouchEvent;
            newMyTouch: (touch: Touch) => void;
        }
    >();

    constructor(private readonly eventManager: EventManager) {}

    public acceptsEvent(event: Event): event is TouchEvent {
        return event instanceof TouchEvent;
    }

    public init(
        element: IElement,
        anchorElement: IElement,
        newTouch: (touch: Touch) => void,
        // newHoverFrame: (frame: TouchFrame) => void,
    ): void {
        if (this.elements.hasItem(element)) {
            throw new Error('Element should not be initialized when using init.');
        }

        const currentMyTouches: { [identifier: number]: Touch } = {};

        const handleMyTouchesStart = (event: TouchEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentMyTouch = new Touch({
                    type: 'TOUCH',
                    anchorElement,
                    buttonIdentifier: touches[i].identifier,
                    firstFrame: createTouchFrameFromEventsTouch(touches[i]),
                });
                currentMyTouches[touches[i].identifier] = currentMyTouch;
                newTouch(currentMyTouch);
            }
        };

        const handleMyTouchesMove = (event: TouchEvent) => {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentMyTouch = currentMyTouches[touches[i].identifier] || null;
                if (currentMyTouch) {
                    currentMyTouch.frames.next(createTouchFrameFromEventsTouch(touches[i]));
                }
            }
        };

        const handleMyTouchesEnd = (event: TouchEvent) => {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentMyTouch = currentMyTouches[touches[i].identifier] || null;
                if (currentMyTouch) {
                    currentMyTouch.frames.complete();
                    delete currentMyTouches[touches[i].identifier];
                }
            }
        };

        const createTouchFrameFromEventsTouch: ICreateTouchFrameFromTouchEvent = (event: DomTouch) => {
            const boundingRect = getBoundingClientRectEnhanced(element);
            return new TouchFrame({
                element,
                anchorElement,
                positionRelative: Vector.fromArray(event.clientX - boundingRect.x, event.clientY - boundingRect.y),
            });
        };

        this.eventManager.addEventListener(
            element,
            'touchstart',
            (event) => handleMyTouchesStart(event),
            TOUCH_LISTENER_OPTIONS,
        );
        this.eventManager.addEventListener(
            element,
            'touchmove',
            (event) => handleMyTouchesMove(event),
            TOUCH_LISTENER_OPTIONS,
        );
        this.eventManager.addEventListener(
            element,
            'touchend',
            (event) => handleMyTouchesEnd(event),
            TOUCH_LISTENER_OPTIONS,
        );
        this.eventManager.addEventListener(
            element,
            'touchcancel',
            (event) => handleMyTouchesEnd(event),
            TOUCH_LISTENER_OPTIONS,
        );

        this.elements.setItem(element, {
            anchorElement,
            createTouchFrameFromEvent: createTouchFrameFromEventsTouch,
            newMyTouch: newTouch,
        });
    }

    public async startFromExternalEvent(element: IElement, originalEvent: TouchEvent): Promise<void> {
        // !!!  What is  startFromExternalEvent
        const item = this.elements.getItem(element);
        if (!item) {
            throw new Error('Element should be initialized when using startFromExternalEvent.');
        }
        const { anchorElement, createTouchFrameFromEvent, newMyTouch } = item;

        const identifier = originalEvent.touches[0].identifier;

        await forAnimationFrame();

        // TODO: maybe DRY this block with block in createMouseListener
        // TODO: better naming in this block

        const currentMyTouch = new Touch({
            type: 'TOUCH',
            anchorElement,
            buttonIdentifier: identifier,
            firstFrame: createTouchFrameFromEvent(originalEvent.touches[0]),
        });

        const getMyTouchFromEvent = (event: TouchEvent) =>
            Array.from(event.touches).find((touch) => touch.identifier === identifier);

        const handleMyTouchMoveOnDocument = (event: TouchEvent) => {
            // TODO: problems with zoom whole page

            const touch = getMyTouchFromEvent(event);
            if (touch) {
                event.preventDefault();
                event.stopPropagation();
                currentMyTouch.frames.next(createTouchFrameFromEvent(touch));
            }
        };
        this.eventManager.addEventListener(document, 'touchmove', handleMyTouchMoveOnDocument, TOUCH_LISTENER_OPTIONS);

        const handleMyTouchUpOnDocument = (/*event: TouchEvent*/) => {
            currentMyTouch.frames.complete();

            this.eventManager.removeEventListener(document, 'touchmove', handleMyTouchMoveOnDocument);

            document.removeEventListener('touchend', handleMyTouchUpOnDocument);
            // }
        };

        this.eventManager.addEventListener(document, 'touchend', handleMyTouchUpOnDocument, TOUCH_LISTENER_OPTIONS);

        newMyTouch(currentMyTouch);
    }
}

type ICreateTouchFrameFromTouchEvent = (event: DomTouch) => TouchFrame;
