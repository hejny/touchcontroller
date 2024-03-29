import { Observable } from 'rxjs/internal/Observable';
import { ITransformData, Transform, Vector } from 'xyzt';
import { Touch } from '../../touch/Touch';
import { TouchController } from '../../touch/TouchController';

interface ITwoFingerringOptions {
    touchController: TouchController;
    touch1: Touch;
    touch2: Touch;
    getElementCenter: () => Vector;
    pick: Array<keyof ITransformData>;
}

export function _twoFingerring({
    touch1,
    touch2,
    getElementCenter,
    pick,
}: ITwoFingerringOptions): Observable<ITransformData> {
    // Note: I can not figure out better name
    return new Observable((observer) => {
        (async () => {
            [
                [touch1, touch2],
                [touch2, touch1],
            ].forEach(async ([centerTouch, actionTouch]) => {
                // TODO: Better distinct between elementCenter and center

                const centerTouchPosition = (await centerTouch.firstFrame).position;
                actionTouch
                    .frameTuples({ itemsPerTuple: 2, startImmediately: false })
                    .subscribe(([actionTouchFrameA, actionTouchFrameB]) => {
                        const a = actionTouchFrameA.position.subtract(centerTouchPosition);
                        const b = actionTouchFrameB.position.subtract(centerTouchPosition);

                        const rotate = pick.includes('rotate') ? b.rotation() - a.rotation() : 0;
                        const scale = pick.includes('scale') ? b.distance() / a.distance() : 1;

                        observer.next(
                            Transform.fromObject({
                                rotate,
                                scale,
                                translate: Vector.zero().applyWithin(
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
