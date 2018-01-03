import Touch from '../Touch';

/*export default interface IListener{
    setListeners: (touchController: TouchController)=>void,
    unsetListeners: ()=>void,
}*/


export default interface IListener{
    (
        element: HTMLElement,
        newTouch: (touch: Touch)=>void
    ): ()=>void;
}