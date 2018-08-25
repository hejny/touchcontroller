import IListener from './IListener';
import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
import Vector2 from '../Vector2';
import { isNull } from 'util';

//todo singleton :(
let onlyTouch: Touch | null = null;

export default function(buttons: number[] = [0], rotating = false): IListener {
    return (
        element: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ) => {
        element.addEventListener(
            'mousedown',
            (event) => _handleMouseDown(event),
            false,
        );
        element.addEventListener(
            'mousemove',
            (event) => _handleMouseMove(event),
            false,
        );
        element.addEventListener(
            'mouseup',
            (event) => _handleMouseUp(event),
            false,
        );
        /*element.addEventListener(
            "mouseleave",
            (event) => _handleMouseUp(true, event),
            false
        );*/

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

        function _handleMouseDown(event: MouseEvent) {
            if (buttons.indexOf(event.button) !== -1) {
                //_handleMouseUp(event);
                if (onlyTouch) {
                    onlyTouch.end();
                }
                currentTouch = new Touch(
                    //this,
                    //this._touchesAutoIncrement++,
                    //eventId,
                    'MOUSE',
                    _createTouchFrameFromEvent(event),
                );
                newTouch(currentTouch);
                onlyTouch = currentTouch;
            }
            //createNewTouch();
        }

        function _handleMouseMove(event: MouseEvent) {
            //console.log(event.buttons);
            if (event.buttons > 0) {
                //if(buttons.indexOf(event.button)!==-1) {todo what the hack? Is thare event.button on mousemove event?
                if (!isNull(currentTouch)) {
                    event.preventDefault();
                    currentTouch.move(_createTouchFrameFromEvent(event), false);
                }
                //}
            } else {
                if (isNull(currentTouch)) {
                    newHoverFrame(_createTouchFrameFromEvent(event));
                }
            }
        }

        function _handleMouseUp(event: MouseEvent) {
            if (buttons.indexOf(event.button) !== -1) {
                event.preventDefault();
                if (!isNull(currentTouch)) {
                    currentTouch.move(_createTouchFrameFromEvent(event), true);
                    currentTouch = null;
                }
            }
        }

        function _createTouchFrameFromEvent(event: MouseEvent) {
            return new TouchFrame(
                element,
                new Vector2(
                    event.clientX - element.offsetLeft,
                    event.clientY - element.offsetTop,
                ),
                performance.now(),
                rotating,
            );
        }

        return () => {
            //todo dispose
        };
    };
}
