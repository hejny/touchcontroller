import { TouchFrame } from '../TouchFrame';
import { Touch } from '../Touch';
import { IEvent } from './IEvent';
export interface IListener {
    title: (event: Event) => boolean;
    (element: HTMLElement | SVGElement, anchorElement: HTMLElement, newTouch: (touch: Touch) => void, newHoverFrame: (frame: TouchFrame) => void, immediateDrag: null | IEvent): () => void;
    acceptsEvent: (event: Event) => boolean;
}
