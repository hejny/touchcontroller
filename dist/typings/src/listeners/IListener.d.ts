import Touch from '../Touch';
export default interface IListener {
    (element: HTMLElement, newTouch: (touch: Touch) => void): () => void;
}
