import { IEvent } from './../interfaces/IEvent';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';
import { Vector2 } from '../Vector2';

const TOUCH_LISTENER_OPTIONS = {
    capture: true,
    passive: false,
};

export function createTouchListener(buttons: number[] = [0]): IListener {
    const listener: any = (
        element: HTMLElement | SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag: null | IEvent,
    ) => {
        element.addEventListener(
            'touchstart',
            (event) => _handleTouchesStart(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchmove',
            (event) => _handleTouchesMove(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchend',
            (event) => _handleTouchesEnd(event as any),
            TOUCH_LISTENER_OPTIONS,
        );
        element.addEventListener(
            'touchcancel',
            (event) => _handleTouchesEnd(event as any),
            TOUCH_LISTENER_OPTIONS,
        );

        let currentTouches: { [identifier: number]: Touch } = {};

        function _handleTouchesStart(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch = new Touch(
                    'TOUCH',
                    anchorElement,
                    _createTouchFrameFromEvent(touches[i]),
                );
                currentTouches[touches[i].identifier] = currentTouch;
                newTouch(currentTouch);
            }
        }

        function _handleTouchesMove(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (currentTouch) {
                    currentTouch.move(
                        _createTouchFrameFromEvent(touches[i]),
                        false,
                    );
                }
            }
        }

        function _handleTouchesEnd(event: TouchEvent) {
            event.preventDefault();
            const touches = event.changedTouches;
            for (let i = 0, l = touches.length; i < l; i++) {
                const currentTouch =
                    currentTouches[touches[i].identifier] || null;
                if (currentTouch) {
                    currentTouch.move(
                        _createTouchFrameFromEvent(touches[i]),
                        true,
                    );
                    delete currentTouches[touches[i].identifier];
                }
            }
        }

        function _createTouchFrameFromEvent(event: IEvent) {
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

        if (immediateDrag) {
            setImmediate(() => {
                const identifier = (immediateDrag as any).touches[0].identifier;
                //console.log((immediateDrag as any).touches[0].identifier);

                {
                    // TODO: maybe DRY this block with block in createMouseListener
                    // TODO: better naming in this block

                    const currentTouch = new Touch(
                        'TOUCH',
                        anchorElement,
                        _createTouchFrameFromEvent(
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
                                _createTouchFrameFromEvent(touch),
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
                        //const touch = getTouchFromEvent(event);
                        //console.log(event.touches);
                        //console.log(touch);

                        //if (touch) {
                        currentTouch.end();

                        document.removeEventListener(
                            'touchmove',
                            handleTouchMoveOnDocument,
                        );

                        document.removeEventListener(
                            'touchend',
                            handleTouchUpOnDocument,
                        );
                        //}
                    };

                    document.addEventListener(
                        'touchend',
                        handleTouchUpOnDocument,
                        TOUCH_LISTENER_OPTIONS,
                    );

                    newTouch(currentTouch);
                    //onlyTouch = currentTouch;
                }
            });
        }

        return () => {
            // TODO: return disposer
        };
    };

    listener.title = `TOUCH`;
    listener.acceptsEvent = (event: Event) => event instanceof TouchEvent;

    return listener;
}
