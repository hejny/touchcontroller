import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform } from 'xyzt';
import { Touch } from '../../main';

export function _twoFingerring(element: BoundingBox, touch1: Touch, touch2: Touch): Observable<Transform> {
    // Note: I can not figure out better name
    return new Observable((observer) => {
        [[touch1, touch2], [touch2, touch1]].forEach(async ([centerTouch, actionTouch]) => {
            const center = (await centerTouch.firstFrame).position;
            actionTouch.frameTuples({ itemsPerTuple: 2, startImmediately: false }).subscribe(([frame1, frame2]) => {

                const a = frame1.position.subtract(center);
                const b = frame2.position.subtract(center);

                const rotate = b.rotation() - a.rotation();
                const scale = b.distance() / a.distance();
                //Vector.fromPolar(-rotate,scale)
                observer.next(Transform.fromObject({
                    rotate,
                    scale,
                    translate: element.center
                        .subtract(center)
                        .rotate({ z: rotate })
                        .scale(scale)
                        .add(center)
                        .subtract(element.center)
                }));


                // TODO: Translate
            });
        });
    });
}
