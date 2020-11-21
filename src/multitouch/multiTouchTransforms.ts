import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Transform, Vector } from 'xyzt';
import { Touch } from '../touch/Touch';
import { MultiTouch } from './MultiTouch';

export function multiTouchTransforms<TElement>(
    multiTouch: MultiTouch<TElement>,
): Observable<Transform> {
    return new Observable((observer) => {
        let subscriptions: Subscription[] = [];

        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                for (const subscription of subscriptions) {
                    subscription.unsubscribe();
                }
                // TODO: maybe subscription = [];

                let countTouchesTransform: (...touches: Touch[]) => Transform;

                if (touches.length === 1) {
                    if (!touches[0].lastFrame.rotating) {
                        countTouchesTransform = () =>
                            Transform.fromObject({
                                translate: touches[0].lastFrame.position,
                            });
                    } else {
                        // TODO: this should be like second picked point is center of bounding box
                        /*
                        TODO: !!
                        countTouchesTransform = () =>
                            Transform.fromObject({
                                rotate: boundingBox.center.rotation(
                                    touches[0].lastFrame.position,
                                ),
                            });

                            */

                        countTouchesTransform = () => Transform.neutral();
                    }
                } else {
                    // TODO: how to figure out with 3, 4, 5,... finger on one object?
                    countTouchesTransform = () =>
                        Transform.fromObject({
                            translate: Vector.add(
                                ...touches.map(
                                    (touch) => touch.lastFrame.position,
                                ),
                            ).scale(1 / touches.length),
                            rotate: touches[0].lastFrame.position.rotation(
                                touches[1].lastFrame.position,
                            ),
                            scale: touches[0].lastFrame.position.distance(
                                touches[1].lastFrame.position,
                            ),
                        });
                }

                let lastTouchesTransform = countTouchesTransform();

                const touchMoveCallback = () => {
                    const currentTouchesTransform = countTouchesTransform();

                    const delta = currentTouchesTransform.apply(
                        lastTouchesTransform.negate(),
                    );

                    observer.next(delta);

                    lastTouchesTransform = currentTouchesTransform;
                };

                subscriptions = touches.map((touch) =>
                    touch.frames.subscribe(touchMoveCallback),
                );
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
