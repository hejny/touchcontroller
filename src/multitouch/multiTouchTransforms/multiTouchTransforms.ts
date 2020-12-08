import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform } from 'xyzt';
import { Multitouch } from '../Multitouch';
import { _dragging } from './dragging';
import { _twoFingerring } from './twoFingerring';

export function multitouchTransforms<TElement extends BoundingBox>(
    multitouch: Multitouch<TElement>,
): Observable<Transform> {
    return new Observable((observer) => {
        multitouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                if (multitouch.element) {
                    // TODO: free the memory
                    // TODO: Debounce
                    // TODO: What about 3 and more fingers

                    if (touches.length === 1) {
                        _dragging(touches[0]).subscribe(observer);
                    } else if (touches.length > 1) {
                        _twoFingerring(multitouch.element, touches[0], touches[1]).subscribe(observer);
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
