import { TouchFrame } from './../TouchFrame';
import { Touch } from '../Touch';

export interface IListener {
    (
        element: HTMLElement|SVGElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void, //todo type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void,
        immediateDrag: boolean
    ): () => void;
}
