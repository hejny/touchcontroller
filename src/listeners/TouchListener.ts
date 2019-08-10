import { IElement } from './../interfaces/IElement';
import { SourceCache } from './../utils/Cache';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../Touch';
import { Vector2 } from '../Vector2';
import { IEvent } from '../interfaces/IEvent';
import { TouchFrame } from '../TouchFrame';

const TOUCH_LISTENER_OPTIONS = {
    capture: true,
    passive: false,
};

export class TouchListener implements IListener {
    public get title() {
        return `TOUCH`;
    }
    public startEventType = `touchstart`;

    public async startFromExternalEvent(element: IElement, event: Event) {}

    private elements = new SourceCache<
        IElement,
        {
            //handleMouseDownOnElement;
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
            'touchstart',
            (event) => handleTouchesStart(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchmove',
            (event) => handleTouchesMove(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchend',
            (event) => handleTouchesEnd(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchcancel',
            (event) => handleTouchesEnd(event as any),
            TOUCH_LISTENER_OPTIONS,
        );

        const currentTouches: { [identifier: number]: Touch } = {};

        function handleTouchesStart(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch = new Touch(
                    'TOUCH',
                    anchorElement,
                    createTouchFrameFromEvent(touches[i]),
                );
                currentTouches[touches[i].identifier] = currentTouch;
                newTouch(currentTouch);
            }
        }

        function handleTouchesMove(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (currentTouch) {
                    currentTouch.move(
                        createTouchFrameFromEvent(touches[i]),
                        false,
                    );
                }
            }
        }

        function handleTouchesEnd(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (currentTouch) {
                    currentTouch.move(
                        createTouchFrameFromEvent(touches[i]),
                        true,
                    );
                    delete currentTouches[touches[i].identifier];
                }
            }
        }

        function createTouchFrameFromEvent(event: IEvent) {
            const boundingRect = element.getBoundingClientRect();
            return new TouchFrame(
                element,
                anchorElement,
                new Vector2(
                    event.clientX - boundingRect.left,
                    event.clientY - boundingRect.top,
                ),
                performance.now(),
            );
        }

        /*
        if (immediateDrag) {
            setImmediate(() => {
                const identifier = (immediateDrag as any).touches[0].identifier;
                // console.log((immediateDrag as any).touches[0].identifier);

                {
                    // TODO: maybe DRY this block with block in createMouseListener
                    // TODO: better naming in this block

                    const currentTouch = new Touch(
                        'TOUCH',
                        anchorElement,
                        createTouchFrameFromEvent(
                            (immediateDrag as any).touches[0],
                        ),
                    );

                    const getTouchFromEvent = (event: TouchEvent) =>
                        Array.from(event.touches).find(
                            (touch) => touch.identifier === identifier,
                        );

                    const handleTouchMoveOnDocument = (event: TouchEvent) => {
                        // TODO: problems with zoom whole page

                        const touch = getTouchFromEvent(event);
                        if (touch) {
                            event.preventDefault();
                            event.stopPropagation();
                            currentTouch.move(
                                createTouchFrameFromEvent(touch),
                                false,
                            );
                        }
                    };
                    document.addEventListener(
                        'touchmove',
                        handleTouchMoveOnDocument,
                        TOUCH_LISTENER_OPTIONS,
                    );

                    const handleTouchUpOnDocument = (event: TouchEvent) => {
                        // const touch = getTouchFromEvent(event);
                        // console.log(event.touches);
                        // console.log(touch);

                        // if (touch) {
                        currentTouch.end();

                        document.removeEventListener(
                            'touchmove',
                            handleTouchMoveOnDocument,
                        );

                        document.removeEventListener(
                            'touchend',
                            handleTouchUpOnDocument,
                        );
                        // }
                    };

                    document.addEventListener(
                        'touchend',
                        handleTouchUpOnDocument,
                        TOUCH_LISTENER_OPTIONS,
                    );

                    newTouch(currentTouch);
                    // onlyTouch = currentTouch;
                }
            });
        }
        */
    }
}

//type IHandleMouseDownOnElement = (event: MouseEvent) => void;
