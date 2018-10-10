import { TouchFrame } from '../TouchFrame';
import { Touch } from '../Touch';
import { IEvent } from './IEvent';

export interface IListener {
    title: (event: Event) => boolean;
    (
        element: HTMLElement | SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void, //todo type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag: null | IEvent,
    ): //acceptsEvent: (event:any)=>boolean
    () => void;
    acceptsEvent: (event: Event) => boolean;
}
