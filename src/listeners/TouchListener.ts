import IListener from './IListener';
import TouchController from '../TouchController';
import Touch from '../Touch';

export default class TouchListener implements IListener {

    private _touchController: TouchController;

    setListeners(touchController: TouchController){
        this._touchController = touchController;
        touchController.element.addEventListener(
            "touchstart",
            (event) => this._handleTouchStart(event),
            false
        );
        touchController.element.addEventListener(
            "touchend",
            (event) => this._handleTouchEnd(true, event),
            false
        );
        touchController.element.addEventListener(
            "touchcancel",
            (event) => this._handleTouchEnd(false, event),
            false
        );
        //todo element.addEventListener("touchleave", (event)=>this._handleTouchEnd(true,event), false);
        touchController.element.addEventListener(
            "touchmove",
            (event) => this._handleTouchMove(event),
            false
        );
    }

    unsetListeners(){
        //todo
    }

    private _handleTouchStart(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchStart(new Touch(
                'touch' + touches[i].identifier,
                'TOUCH'
            ));
        }
    }

    private _handleTouchMove(event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchMove('touch' + touches[i].identifier, false, touches[i]);
        }
    }

    private _handleTouchEnd(callSubscribers: boolean, event: TouchEvent) {
        event.preventDefault();
        const touches = event.changedTouches;
        for (let i = 0, l = touches.length; i < l; i++) {
            this._touchController.touchMove('touch' + touches[i].identifier, callSubscribers, touches[i]);
        }
    }
}