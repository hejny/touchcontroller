import { IElement } from '../interfaces/IElement';


export function getBoundingClientRectEnhanced(element: IElement): DOMRect {
    if (element instanceof Document) {
        // TODO: Is this solution good?
        return getBoundingClientRectEnhanced(element.body);
        /*return {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,

            height: element.body.
            readonly width: number;
        }*/
    } else {
        return element.getBoundingClientRect();
    }
}


/**
 * TODO: Maybe better function name
 * TODO: Anotate
 * TODO: Write tests
 */
