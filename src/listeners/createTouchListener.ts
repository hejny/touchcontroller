import { IEvent } from './../interfaces/IEvent';
import { IListener } from '../interfaces/IListener';
import { TouchFrame } from '../TouchFrame';
import { Touch } from '../Touch';
import { Vector2 } from '../Vector2';

export function createTouchListener(buttons: number[] = [0]): IListener {
    const listener:any = (
        element: HTMLElement|SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag: null|IEvent
    ) => {
        element.addEventListener(
            'touchstart',
            (event) => _handleTouchesStart(event as any),
            false,
        );
        element.addEventListener(
            'touchmove',
            (event) => _handleTouchesMove(event as any),
            false,
        );
        element.addEventListener(
            'touchend',
            (event) => _handleTouchesEnd(event as any),
            false,
        );
        element.addEventListener(
            'touchcancel',
            (event) => _handleTouchesEnd(event as any),
            false,
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

        return () => {
            //todo return disposer
        };
    };

    listener.title = `TOUCH`;
    listener.acceptsEvent = (event:Event)=>event instanceof TouchEvent;

    return listener;
}
