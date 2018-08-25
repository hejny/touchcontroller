import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
export default interface IListener {
    (element: HTMLElement, anchorElement: HTMLElement, newTouch: (touch: Touch) => void, newHoverFrame: (frame: TouchFrame) => void): () => void;
}
