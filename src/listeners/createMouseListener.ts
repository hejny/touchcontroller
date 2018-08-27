import IListener from './IListener';
import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
import Vector2 from '../Vector2';

//todo singleton :(
let onlyTouch: Touch | null = null;

export default function(buttons: number[] = [0], rotating = false): IListener {
    return (
        element: HTMLElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ) => {
        element.addEventListener(
            'mousedown',
            (event) => _handleMouseDownOnElement(event),
            false,
        );

        element.addEventListener(
            'mousemove',
            (event) => _handleMouseMoveOnElement(event),
            false,
        );

        //todo configurable mouse buttons
        element.addEventListener(
            'contextmenu',
            (event) => {
                event.preventDefault();
                event.stopPropagation();
            },
            false,
        );

        let currentTouch: Touch | null = null;

        function _handleMouseDownOnElement(event: MouseEvent) {
            if (buttons.indexOf(event.button) !== -1) {
                if (onlyTouch) {
                    onlyTouch.end();
                }
                currentTouch = new Touch(
                    'MOUSE',
                    anchorElement,
                    _createTouchFrameFromEvent(event),
                );

                document.addEventListener(
                    'mousemove',
                    _handleMouseMoveOnDocument,
                    false,
                );

                const mouseUpListenerOnDocument = () => {
                    console.log('mouseup');

                    if (currentTouch) {
                        currentTouch.end();
                        currentTouch = null;
                    }

                    document.removeEventListener(
                        'mousemove',
                        _handleMouseMoveOnDocument,
                    );

                    document.removeEventListener(
                        'mouseup',
                        mouseUpListenerOnDocument,
                    );
                };

                document.addEventListener(
                    'mouseup',
                    mouseUpListenerOnDocument,
                    false,
                );

                newTouch(currentTouch);
                onlyTouch = currentTouch;
            }
        }

        function _handleMouseMoveOnDocument(event: MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
            if (currentTouch) {
                currentTouch.move(_createTouchFrameFromEvent(event), false);
            }
        }

        function _handleMouseMoveOnElement(event: MouseEvent) {
            if (event.buttons > 0) {
            } else {
                if (!currentTouch) {
                    newHoverFrame(_createTouchFrameFromEvent(event));
                }
            }
        }

        function _createTouchFrameFromEvent(event: MouseEvent) {
            const boundingRect = element.getBoundingClientRect();
            return new TouchFrame(
                element,
                anchorElement,
                new Vector2(
                    event.clientX - boundingRect.left,
                    event.clientY - boundingRect.top,
                ),
                performance.now(),
                rotating,
            );
        }

        return () => {
            //todo return disposer
        };
    };
}
