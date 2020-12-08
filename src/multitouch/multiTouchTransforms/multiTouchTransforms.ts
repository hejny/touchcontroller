import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform, Vector } from 'xyzt';
import { Multitouch } from '../Multitouch';
import { _dragging } from './dragging';
import { _twoFingerring } from './twoFingerring';

export function multitouchTransforms(
    multitouch: Multitouch<BoundingBox>,
    elementCenter: () => Vector,
): Observable<Transform> {
    return new Observable((observer) => {
        multitouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                // TODO: free the memory
                // TODO: Debounce
                // TODO: What about 3 and more fingers

                if (touches.length === 1) {
                    _dragging(touches[0]).subscribe(observer);
                } else if (touches.length > 1) {
                    _twoFingerring(elementCenter, touches[0], touches[1]).subscribe(observer);
                }
            },
            // TODO: Maybe error and complete callbacks not nessesary
            (error) => {
                observer.error(error);
            },
            () => {
                observer.complete();
            },
        );
    });
}
