import { Observable } from 'rxjs/internal/Observable';
import { Transform, Vector } from 'xyzt';
import { Touch } from '../../main';

export function _dragging(touch: Touch): Observable<Transform> {
    return new Observable((observer) => {
        touch.frameTuples({ itemsPerTuple: 2, startImmediately: false }).subscribe(([frame1, frame2]) => {
            observer.next(Transform.translate(Vector.subtract(frame2.point, frame1.point)));
        });
    });
}
