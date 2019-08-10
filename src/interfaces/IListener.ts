import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';

// TODO: This should be maybe regular Class not a Function
export interface IListener {
    init: (
        element: HTMLElement | SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void, // TODO: type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void, // acceptsEvent: (event:any)=>boolean
    ) => //immediateDrag: null | Event,
    void;
    // TODO: dispose: () => void;
    title: string;
    startDrag: (event: Event) => void;
    initialEventType: string;
    // acceptsEvent: (event: Event) => boolean;
}
