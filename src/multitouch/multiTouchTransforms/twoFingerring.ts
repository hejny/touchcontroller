import { Observable } from 'rxjs/internal/Observable';
import { ITransform, Transform, Vector } from 'xyzt';
import { emulateTouch, Touch, TouchController } from '../../main'; // TODO: !!!

interface ITwoFingerringOptions {
    // TODO: !!!
    touchController: TouchController;
    touch1: Touch;
    touch2: Touch;
    getElementCenter: () => Vector;
    pick: Array<keyof ITransform>;
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
            //const centerTouch = await emulateTouch(touchController, { position: getElementCenter() });

            [
                [touch1, touch2],
                //[touch2, touch1],

                //[centerTouch, touch1],
                //[centerTouch, touch2],
                /*
            TODO: !!!
            [touch1, touch2],
            [touch2, touch1],
            */
            ].forEach(async ([centerTouch, actionTouch]) => {
                // TODO: Better distinct between elementCenter and center

                const centerTouchPosition = /*getElementCenter(); // !!!*/ (
                    await centerTouch.firstFrame
                ) /* !!! last frame */.position;
                actionTouch
                    .frameTuples({ itemsPerTuple: 2, startImmediately: false })
                    .subscribe(([actionTouchFrameA, actionTouchFrameB]) => {
                        const a = actionTouchFrameA.position.subtract(centerTouchPosition);
                        const b = actionTouchFrameB.position.subtract(centerTouchPosition);

                        const rotate = pick.includes('rotate') ? b.rotation() - a.rotation() : 0;
                        let scale = pick.includes('scale') ? b.distance() / a.distance() : 1;
                        scale = 1;
                        //Vector.fromPolar(-rotate,scale)

                        const tPos = getElementCenter().subtract(centerTouchPosition);
                        const t = Transform.translate(tPos);

                        observer.next(
                            Transform.fromObject({
                                rotate,
                                scale,
                                translate: tPos.negate().within(t, (v) => v.rotate({ z: rotate }).scale(scale)),
                                // !!! Vector.zero().rotate({ z: rotate }).scale(scale),
                                // !!! Vector.zero().within(t, (v) => v.rotate({ z: rotate }).scale(scale)),
                            }),
                        );

                        // TODO: Translate
                    });
            });
        })();
    });
}
