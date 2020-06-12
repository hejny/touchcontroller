import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { BoundingBox } from './BoundingBox';
import { MultiTouch } from './MultiTouch';
import { Touch } from './Touch';
import { Transformation } from './Transformation';
import { Vector } from 'xyzt';

export function multiTouchTransformations<TElement>(
    multiTouch: MultiTouch<TElement>,
    boundingBox: BoundingBox = BoundingBox.One(),
): Observable<Transformation> {
    return Observable.create((observer: Observer<Transformation>) => {
        let subscriptions: Subscription[] = [];

        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                for (const subscription of subscriptions) {
                    subscription.unsubscribe();
                }
                // TODO: maybe subscription = [];

                let countTouchesTransformation: (
                    ...touches: Touch[]
                ) => Transformation;
                if (touches.length === 1) {
                    if (!touches[0].lastFrame.rotating) {
                        countTouchesTransformation = () =>
                            new Transformation(
                                touches[0].lastFrame.position,
                                0,
                                undefined,
                                1,
                            );
                    } else {
                        // TODO: this should be like second picked point is center of bounding box
                        countTouchesTransformation = () =>
                            new Transformation(
                                undefined,
                                boundingBox.center.rotation(
                                    touches[0].lastFrame.position,
                                ),
                                undefined,
                                1,
                            );
                    }
                } else {
                    // TODO: how to figure out with 3, 4, 5,... finger on one object?
                    countTouchesTransformation = () =>
                        new Transformation(
                            Vector.Zero()
                                .add(
                                    ...touches.map(
                                        (touch) => touch.lastFrame.position,
                                    ),
                                )
                                .scale(1 / touches.length),
                            touches[0].lastFrame.position.rotation(
                                touches[1].lastFrame.position,
                            ),
                            undefined,
                            touches[0].lastFrame.position.length(
                                touches[1].lastFrame.position,
                            ),
                        );
                }

                let lastTouchesTransformation = countTouchesTransformation();

                const touchMoveCallback = () => {
                    const currentTouchesTransformation = countTouchesTransformation();

                    const deltaTransformation = currentTouchesTransformation.subtract(
                        lastTouchesTransformation,
                    );

                    boundingBox.applyTransformation(deltaTransformation);
                    observer.next(deltaTransformation);

                    lastTouchesTransformation = currentTouchesTransformation;
                };

                subscriptions = touches.map((touch) =>
                    touch.frames.subscribe(touchMoveCallback),
                );
            },
            () => undefined,
            () => {
                observer.complete();
            },
        );
    });
}
