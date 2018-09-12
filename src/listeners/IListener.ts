import TouchFrame from "../../dist/typings/src/TouchFrame";

export interface IListener {
    (
        element: HTMLElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ): () => void;
}
