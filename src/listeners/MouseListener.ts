import IListener from './IListener';
import TouchController from '../TouchController';

export default class TouchListener implements IListener {

    private _touchController: TouchController;

    constructor(private _preventContextMenu = true) {
    }

    setListeners(touchController: TouchController) {
        this._touchController = touchController;
        touchController.element.addEventListener(
            "mousedown",
            (event) => this._handleMouseDown(event),
            false
        );
        touchController.element.addEventListener(
            "mousemove",
            (event) => this._handleMouseMove(event),
            false
        );
        touchController.element.addEventListener(
            "mouseup",
            (event) => this._handleMouseUp(true, event),
            false
        );
        touchController.element.addEventListener(
            "mouseleave",
            (event) => this._handleMouseUp(true, event),
            false
        );

        if (this._preventContextMenu) {
            touchController.element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, false);
        }
    }

    unsetListeners() {
        //todo
    }

    private _handleMouseDown(event: MouseEvent) {
        event.preventDefault();
        this._touchController.touchStart('mouse' + event.button, 'MOUSE', event);
    }

    private _handleMouseMove(event: MouseEvent) {
        event.preventDefault();
        this._touchController.touchMove('mouse' + event.button, false, event);
    }


    private _handleMouseUp(callSubscribers: boolean, event: MouseEvent) {
        event.preventDefault();
        this._touchController.touchMove('mouse' + event.button, callSubscribers, event);
    }
}