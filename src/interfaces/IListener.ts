import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';
import { Awaitable } from './IAwaitable';
import { IElement } from './IElement';

// TODO: This should be maybe regular Class not a Function
export interface IListener {
    title: string;
    init: (
        element: IElement,
        anchorElement: IElement,
        newTouch: (touch: Touch) => void, // TODO: type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void, // acceptsEvent: (event:any)=>boolean
    ) => void;
    // TODO: dispose: () => void;

    acceptsEvent: (event: Event) => boolean;
    startFromExternalEvent: (
        element: IElement,
        event: Event,
    ) => Awaitable<void>;
    startEventType: string;
}
