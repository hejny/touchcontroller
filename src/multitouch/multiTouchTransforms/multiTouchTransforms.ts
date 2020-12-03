import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform } from 'xyzt';
import { MultiTouch } from '../MultiTouch';
import { _dragging } from './dragging';
import { _twoFingerring } from './twoFingerring';


export function multiTouchTransforms<TElement extends BoundingBox>(
    multiTouch: MultiTouch<TElement>,
): Observable<Transform> {

    
    return new Observable((observer) => {
        
        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {

                if(multiTouch.element){
                
                    // TODO: free the memory
                    // TODO: Debounce
                    // TODO: What about 3 and more fingers

                    if(touches.length===1){
                        _dragging( touches[0]).subscribe(observer);
                
                    }else
                    if(touches.length>1){
                        _twoFingerring( multiTouch.element,touches[0], touches[1]).subscribe(observer);
                    }

                }

            },
            (error) => {
                observer.error(error);
            },
            () => {
                observer.complete();
            },
        );
    });
}