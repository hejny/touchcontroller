import { Observable } from 'rxjs/internal/Observable';
import { ITransform, Transform, Vector } from 'xyzt';
import { Touch } from '../../main';

interface ITwoFingerringOptions {
    touch1: Touch;
    touch2: Touch;
    getElementCenter: () => Vector;
    pick: Array<keyof ITransform>;
}

export function _twoFingerring({
    touch1,
    touch2,
    getElementCenter,
    pick,
}: ITwoFingerringOptions): Observable<Transform> {
    // Note: I can not figure out better name
    return new Observable((observer) => {
        [
            [touch1, touch2],
            [touch2, touch1],
        ].forEach(async ([centerTouch, actionTouch]) => {
            // TODO: Better distinct between elementCenter and center

            const center = (await centerTouch.firstFrame).position;
            actionTouch.frameTuples({ itemsPerTuple: 2, startImmediately: false }).subscribe(([frame1, frame2]) => {
                const a = frame1.position.subtract(center);
                const b = frame2.position.subtract(center);

                const rotate = pick.includes('rotate') ? b.rotation() - a.rotation() : 0;
                const scale = pick.includes('scale') ? b.distance() / a.distance() : 1;
                //Vector.fromPolar(-rotate,scale)
                observer.next(
                    Transform.fromObject({
                        rotate,
                        scale,
                        translate: getElementCenter()
                            .subtract(center)
                            .rotate({ z: rotate })
                            .scale(scale)
                            .add(center)
                            .subtract(getElementCenter()),
                    }),
                );

                // TODO: Translate
            });
        });
    });
}
