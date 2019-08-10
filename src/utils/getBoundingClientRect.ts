import { IElement } from "../interfaces/IElement";

export function getBoundingClientRectEnhanced(element: IElement): ClientRect | DOMRect{
    if(element instanceof Document){
        return getBoundingClientRectEnhanced(element.body);
        /*return {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,

            height: element.body.
            readonly width: number;
        }*/
    }else{
        return element.getBoundingClientRect();
    }
}