import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform, Vector } from 'xyzt';
import { Touch } from '../main';
import { MultiTouch } from './MultiTouch';


export function multiTouchTransforms<TElement extends BoundingBox>(
    multiTouch: MultiTouch<TElement>,
): Observable<Transform> {

    
    return new Observable((observer) => {
        
        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {

                if(multiTouch.element){
                
                    // TODO: free the memory
                    // TODO: Debounce
                    // TODO: What about 3 and more fingers

                    if(touches.length===1){
                        dragging( touches[0]).subscribe(observer);
                
                    }else
                    if(touches.length>1){
                        twoFingerring( multiTouch.element,touches[0], touches[1]).subscribe(observer);
                    }

                }

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








function dragging(touch: Touch): Observable<Transform> {
    return new Observable((observer) => {
        touch.frameTuples({itemsPerTuple: 2, startImmediately: false}).subscribe(([frame1, frame2]) => {
            observer.next(Transform.translate(Vector.subtract(frame2.position, frame1.position)));
        });
    });
}


function twoFingerring(element:BoundingBox,touch1: Touch,touch2: Touch): Observable<Transform> {
    // Note: I can not figure out better name
    return new Observable((observer) => {
        [[touch1,touch2],[touch2,touch1]].forEach(async ([centerTouch,actionTouch])=>{
            const center =  (await centerTouch.firstFrame).position;
            actionTouch.frameTuples({itemsPerTuple: 2, startImmediately: false}).subscribe(([frame1, frame2]) => {
            
                const a = frame1.position.subtract(center);
                const b = frame2.position.subtract(center);

                const rotate =   b.rotation()-a.rotation();
                const scale = b.distance()/a.distance();
                //Vector.fromPolar(-rotate,scale)

                observer.next(Transform.fromObject({
                    rotate,
                    scale,
                    translate: element.center
                        .subtract(center)
                        .rotate({z:rotate})
                        .scale(scale)
                        .add(center)
                        .subtract(element.center)
                }));
               

                // TODO: Translate

            });
        });
    });
}


/*

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Transform, Vector } from 'xyzt';
import { Touch } from '../touch/Touch';
import { MultiTouch } from './MultiTouch';

function multiTouchTransforms<TElement>(
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
                    if (!touches[0].lastFrame!.rotating) {
                        countTouchesTransform = () =>
                            Transform.fromObject({
                                translate: touches[0].lastFrame!.position,
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

                            * /

                           countTouchesTransform = () => Transform.neutral();
                        }
                    } else {
                        // TODO: how to figure out with 3, 4, 5,... finger on one object?
                        countTouchesTransform = () =>
                            Transform.fromObject({
                                translate: Vector.add(
                                    ...touches.map(
                                        (touch) => touch.lastFrame!.position,
                                    ),
                                ).scale(1 / touches.length),
                                rotate: touches[0].lastFrame!.position.rotation(
                                    touches[1].lastFrame!.position,
                                ),
                                scale: touches[0].lastFrame!.position.distance(
                                    touches[1].lastFrame!.position,
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
    */