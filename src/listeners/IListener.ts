import Touch from '../Touch';
import TouchFrame from '../TouchFrame';

/*export default interface IListener{
    setListeners: (touchController: TouchController)=>void,
    unsetListeners: ()=>void,
}*/

export default interface IListener {
    (
        element: HTMLElement,
        newTouch: (touch: Touch) => void,
        newHoverFrame: (frame: TouchFrame) => void,
    ): () => void;
}
