import { IElement } from './IElement';
import { Awaitable } from './IAwaitable';
import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';

// TODO: This should be maybe regular Class not a Function
export interface IListener<TEventType> {
    title: string;
    init: (
        element: IElement,
        anchorElement: HTMLElement,
        newTouch: (touch: Touch) => void, // TODO: type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void, // acceptsEvent: (event:any)=>boolean
    ) => //immediateDrag: null | Event,
    void;
    // TODO: dispose: () => void;

    startFromExternalEvent: (
        element: IElement,
        event: TEventType,
    ) => Awaitable<void>;
    startEventType: string;
}
