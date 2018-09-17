import { IListener } from './listeners/IListener';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { TouchFrame } from './TouchFrame';
import { Touch } from './Touch';
export declare class TouchController {
    elements: HTMLElement[];
    anchorElement: HTMLElement;
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    private _touchesObserver;
    private _hoveredFramesObserver;
    static fromCanvas(canvas: HTMLCanvasElement): TouchController;
    constructor(elements: HTMLElement[], anchorElement: HTMLElement, setListeners?: boolean);
    private listeners;
    addListener(listener: IListener): void;
    addElement(element: HTMLElement): void;
    callListenerOnElement(listener: IListener, element: HTMLElement): void;
    emulateTouch(touch: Touch): void;
}
