export type IElement = Pick<Element, 'getBoundingClientRect' | 'addEventListener' | 'removeEventListener'>;
export type IElementListeners = Pick<Element, 'addEventListener' | 'removeEventListener'>;
