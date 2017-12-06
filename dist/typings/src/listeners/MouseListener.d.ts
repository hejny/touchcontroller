import IListener from './IListener';
import TouchController from '../TouchController';
export default class TouchListener implements IListener {
    private _preventContextMenu;
    private _touchController;
    constructor(_preventContextMenu?: boolean);
    setListeners(touchController: TouchController): void;
    unsetListeners(): void;
    private _handleMouseDown(event);
    private _handleMouseMove(event);
    private _handleMouseUp(callSubscribers, event);
}
