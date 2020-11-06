import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observer } from 'rxjs/internal/types';
import { Transform, Vector } from 'xyzt';

import { MultiTouch } from './MultiTouch';
import { Touch } from './Touch';
import { BoundingBox } from './utils/BoundingBox/BoundingBox';

export function multiTouchTransforms<TElement>(
    multiTouch: MultiTouch<TElement>,
    boundingBox: BoundingBox = BoundingBox.neutral(),
): Observable<Transform> {
    return new Observable((observer: Observer<Transform>) => {
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
                        countTouchesTransform = () =>
                            Transform.fromObject({
                                rotate: boundingBox.center.rotation(
                                    touches[0].lastFrame.position,
                                ),
                            });
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

                    const deltaTransform = currentTouchesTransform.subtract(
                        lastTouchesTransform,
                    );

                    boundingBox.applyTransform(deltaTransform);
                    observer.next(deltaTransform);

                    lastTouchesTransform = currentTouchesTransform;
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
