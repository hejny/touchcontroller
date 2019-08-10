import { IElement } from './../interfaces/IElement';

export class EventManager {
    private listeners: {
        element: IElement;
        eventType: string;
        callback: IListenerCallback;
    }[] = [];

    addEventListener(
        element: IElement,
        eventType: string,
        callback: IListenerCallback,
        options?: AddEventListenerOptions | boolean,
    ) {
        element.addEventListener(eventType, callback, options);
        this.listeners.push({ element, eventType, callback });
    }

    removeEventListener(
        element: IElement,
        eventType: string,
        callback: IListenerCallback,
    ) {
        element.removeEventListener(eventType, callback);
    }

    /**
     *
     * @param element  Element or * as wildcard
     * @param eventType String of event type - for example pointerdown or * as wildcard
     */
    removeEventListeners(
        element: IElement | '*' = '*',
        eventType: string = '*',
    ) {
        // TODO: eventType wildcard
        for (const listener of this.listeners.filter(
            (listener) =>
                (listener.element === element || element === '*') &&
                (listener.eventType === eventType || eventType === '*'),
        )) {
            console.log(
                `Removing event listener on "${eventType}" from element.`,
                element,
                listener,
            );
            listener.element.removeEventListener(
                listener.eventType,
                listener.callback,
            );
        }
    }

    updateEventListener(
        element: IElement,
        eventType: string,
        callback: IListenerCallback,
        options?: AddEventListenerOptions | boolean,
    ) {
        this.removeEventListeners(element, eventType);
        this.addEventListener(element, eventType, callback, options);
    }
}

type IListenerCallback = (
    event: any /*Event | TouchEvent | MouseEvent | PointerEvent /* TODO: Better */,
) => void;
