import { TouchFrame } from '../TouchFrame';
import { Touch } from '../Touch';
export interface IListener {
    title: (event: Event) => boolean;
    (element: HTMLElement | SVGElement, anchorElement: HTMLElement, newTouch: (touch: Touch) => void, newHoverFrame: (frame: TouchFrame) => void, immediateDrag: null | Event): () => void;
    acceptsEvent: (event: Event) => boolean;
}
