import { Touch } from '../touch/Touch';
import { TouchFrame } from '../touch/TouchFrame';
import { IAwaitable } from './IAwaitable';
import { IElement } from './IElement';

// TODO: This should be maybe regular Class not a Function
export interface IListener<TEvent extends Event> {
    title: string;
    init: (
        element: IElement,
        anchorElement: IElement,
        newTouch: (touch: Touch) => void, // TODO: type Touch is not a good name because of it exist in default typings
        newHoverFrame: (frame: TouchFrame) => void, // acceptsEvent: (event:any)=>boolean
    ) => void;
    // TODO: dispose: () => void;

    acceptsEvent: (event: Event) => event is TEvent;
    startFromExternalEvent: (element: IElement, event: TEvent) => IAwaitable<void>;
    startEventType: string;
}
