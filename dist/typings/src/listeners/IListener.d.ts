import { TouchFrame } from './../TouchFrame';
import { Touch } from '../Touch';
export interface IListener {
    (element: HTMLElement, anchorElement: HTMLElement, newTouch: (touch: Touch) => void, newHoverFrame: (frame: TouchFrame) => void): () => void;
}
