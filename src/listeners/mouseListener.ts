import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
import Vector2 from '../Vector2';

export default function mouseListener(element: HTMLElement,
                                      newTouch: (touch: Touch) => void) {

        element.addEventListener(
        'mousedown',
        (event) => _handleMouseDown(event),
        false
    );
    element.addEventListener(
        'mousemove',
        (event) => _handleMouseMove(event),
        false
    );
    element.addEventListener(
        'mouseup',
        (event) => _handleMouseUp(true, event),
        false
    );
    /*element.addEventListener(
        "mouseleave",
        (event) => _handleMouseUp(true, event),
        false
    );*/

    //todo configurable mouse buttons
    element.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
    }, false);

    let currentTouch: Touch;

    function _handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        currentTouch = new Touch(
            //this,
            //this._touchesAutoIncrement++,
            //eventId,
            'MOUSE',
            _createTouchFrameFromEvent(event)
        );
        newTouch(currentTouch);

        //createNewTouch();
    }

    function _handleMouseMove(event: MouseEvent) {
        event.preventDefault();
        currentTouch.move(
            _createTouchFrameFromEvent(event),
            false
        );
    }


    function _handleMouseUp(callSubscribers: boolean, event: MouseEvent) {
        event.preventDefault();
        currentTouch.move(
            _createTouchFrameFromEvent(event),
            true
        );
    }

    function _createTouchFrameFromEvent(event: MouseEvent) {
        return new TouchFrame(
            new Vector2(
                event.clientX - element.offsetLeft,
                event.clientY - element.offsetTop
            ),
            performance.now()
        );
    }

    return () => {
        //todo dispose
    };

}