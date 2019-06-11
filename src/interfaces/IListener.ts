import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';

export interface IListener {
    title: (event: Event) => boolean;
    (
        element: HTMLElement | SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void, //todo type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag: null | Event,
    ): //acceptsEvent: (event:any)=>boolean
    () => void;
    acceptsEvent: (event: Event) => boolean;
}
