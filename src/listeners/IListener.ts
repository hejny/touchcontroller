import Touch from '../Touch';
import TouchFrame from '../TouchFrame';

export interface IListener {
    (
        element: HTMLElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ): () => void;
}
