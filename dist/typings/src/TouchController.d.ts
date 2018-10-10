import { IListener } from './interfaces/IListener';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { TouchFrame } from './TouchFrame';
import { Touch } from './Touch';
export declare class TouchController {
    elements: (HTMLElement | SVGElement)[];
    anchorElement: HTMLElement;
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    private _touchesObserver;
    private _hoveredFramesObserver;
    static fromCanvas(canvas: HTMLCanvasElement): TouchController;
    constructor(elements: (HTMLElement | SVGElement)[], anchorElement: HTMLElement, setListeners?: boolean);
    private listeners;
    addListener(listener: IListener): void;
    addElement(element: HTMLElement | SVGElement, immediateDrag?: null | Event): void;
    private callListenerOnElement(listener, element, immediateDrag);
    emulateTouch(touch: Touch): void;
}
