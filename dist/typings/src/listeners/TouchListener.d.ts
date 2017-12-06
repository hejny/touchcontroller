import IListener from './IListener';
import TouchController from '../TouchController';
export default class TouchListener implements IListener {
    private _touchController;
    setListeners(touchController: TouchController): void;
    unsetListeners(): void;
    private _handleTouchStart(event);
    private _handleTouchMove(event);
    private _handleTouchEnd(callSubscribers, event);
}
