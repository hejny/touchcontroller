import { Observable } from 'rxjs/internal/Observable';
import { ITransformData, Transform, Vector } from 'xyzt';
import { Touch, TouchController } from '../../main';

interface ITwoFingerringOptions {
    // TODO: !!!
    touchController: TouchController;
    touch1: Touch;
    touch2: Touch;
    getElementCenter: () => Vector;
    pick: Array<keyof ITransformData>;
}

export function _twoFingerring({
    touchController,
    touch1,
    touch2,
    getElementCenter,
    pick,
}: ITwoFingerringOptions): Observable<Transform> {
    // Note: I can not figure out better name
    return new Observable((observer) => {
        (async () => {
            [
                [touch1, touch2],
                [touch2, touch1],
            ].forEach(async ([centerTouch, actionTouch]) => {
                // TODO: Better distinct between elementCenter and center

                const centerTouchPosition = (await centerTouch.firstFrame).point;
                actionTouch
                    .frameTuples({ itemsPerTuple: 2, startImmediately: false })
                    .subscribe(([actionTouchFrameA, actionTouchFrameB]) => {
                        const a = actionTouchFrameA.point.subtract(centerTouchPosition);
                        const b = actionTouchFrameB.point.subtract(centerTouchPosition);

                        const rotate = pick.includes('rotate') ? b.rotation() - a.rotation() : 0;
                        const scale = pick.includes('scale') ? b.distance() / a.distance() : 1;

                        observer.next(
                            Transform.fromObject({
                                rotate,
                                scale,
                                translate: Vector.zero().within(
                                    Transform.translate(getElementCenter().subtract(centerTouchPosition)),
                                    (v) => v.rotate({ z: rotate }).scale(scale),
                                ),
                            }),
                        );
                    });
            });
        })();
    });
}
