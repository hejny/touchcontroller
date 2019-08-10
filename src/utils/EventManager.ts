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
        options?: AddEventListenerOptions | boolean
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

    removeAllEventListeners(element: IElement, eventType: string) {
        //todo eventType wildcard
        for (const listener of this.listeners.filter(
            (listener) =>
                listener.element === element &&
                listener.eventType === eventType,
        )) {
            element.removeEventListener(listener.eventType, listener.callback);
        }
    }

    updateEventListener(
        element: IElement,
        eventType: string,
        callback: IListenerCallback,
        options?: AddEventListenerOptions | boolean
    ) {
        this.removeAllEventListeners(element, eventType);
        this.addEventListener(element, eventType, callback, options);
    }
}

export const eventManager = new EventManager();
type IListenerCallback = (event: any /*Event | TouchEvent | MouseEvent | PointerEvent /* TODO: Better */) => void;
