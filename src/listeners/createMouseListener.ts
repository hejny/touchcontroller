import { IEvent } from './../interfaces/IEvent';
import { TouchFrame } from './../TouchFrame';
import { IListener } from '../interfaces/IListener';
import { Touch } from '../Touch';
import { Vector2 } from '../Vector2';

//todo singleton :(
let onlyTouch: Touch | null = null;

export function createMouseListener(
    buttons: number[] = [0],
    rotating = false,
): IListener {
    return (
        element: HTMLElement|SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag:null|IEvent
    ) => {
        element.addEventListener(
            'mousedown',
            (event) => _handleMouseDownOnElement(event as any),
            false,
        );

        element.addEventListener(
            'mousemove',
            (event) => _handleMouseMoveOnElement(event as any),
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

        if(immediateDrag){
            setImmediate(()=>{
                _handleStart(_createTouchFrameFromEvent(immediateDrag));
            });
        }

        function _handleMouseDownOnElement(event: MouseEvent) {
            if (buttons.indexOf(event.button) !== -1) {
                event.preventDefault();
                event.stopPropagation();
                _handleStart(_createTouchFrameFromEvent(event));
            }
        }

        function _handleStart(firstTouchFrame: TouchFrame) {

                if (onlyTouch) {
                    onlyTouch.end();
                }

                currentTouch = new Touch(
                    'MOUSE',
                    anchorElement,
                    firstTouchFrame,
                );

                document.addEventListener(
                    'mousemove',
                    _handleMouseMoveOnDocument,
                    false,
                );

                const mouseUpListenerOnDocument = () => {
                    //console.log('mouseup');

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
                rotating,
            );
        }

        return () => {
            //todo return disposer
        };
    };
}
