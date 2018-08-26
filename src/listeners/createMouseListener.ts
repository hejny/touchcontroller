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
            (event) => _handleMouseDown(event),
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
                    anchorElement,
                    _createTouchFrameFromEvent(event),
                );

                document.addEventListener(
                    'mousemove',
                    _handleMouseMove,
                    false,
                );

                const mouseUpListener = ()=>{

                    console.log('mouseup');
                
                    document.removeEventListener(
                        'mousemove',
                        _handleMouseMove
                    );

                    document.removeEventListener(
                        'mouseup',
                        mouseUpListener
                    );

                }
                
                document.addEventListener(
                    'mouseup',
                    mouseUpListener,
                    false,
                );

               


                newTouch(currentTouch);
                onlyTouch = currentTouch;
            }
            //createNewTouch();
        }

        
        function _handleMouseMove(event: MouseEvent) {
            event.preventDefault();
            event.stopPropagation();
            //const globalPosition = new Vector2(event.clientX,event.clientY);
            //console.log('_handleMouseMove',globalPosition);

            if(currentTouch){
                //console.log('Moving current touch.');
                currentTouch.move(_createTouchFrameFromEvent(event), false);
            }
        }


        /*function _handleMouseMove(event: MouseEvent) {
            console.log('_handleMouseMove');
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
        }*/

        /*function _handleMouseUp(event: MouseEvent) {
            if (buttons.indexOf(event.button) !== -1) {
                event.preventDefault();
                if (!isNull(currentTouch)) {
                    currentTouch.move(_createTouchFrameFromEvent(event), true);
                    currentTouch = null;
                }
            }
        }*/

        function _createTouchFrameFromEvent(event: MouseEvent) {
            //console.log('event.clientX',event.clientX,element.offsetLeft);
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
            //todo dispose
        };
    };
}
