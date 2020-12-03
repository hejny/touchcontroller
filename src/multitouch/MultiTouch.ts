import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observer } from 'rxjs/internal/types';
import * as uuid from 'uuid';
import { BoundingBox, Transform } from 'xyzt';

import { Touch } from '../touch/Touch';
import { multiTouchTransforms } from './multiTouchTransforms/multiTouchTransforms';

let id = 0;
export class MultiTouch<TElement extends BoundingBox> {
    public readonly id = id++;
    public readonly uuid = uuid.v4();
    public empty = true;
    public ongoingTouches: Touch[] = [];
    public readonly touches = new Subject<Touch>();

    constructor(
        public element: TElement | undefined, // TODO: this should be external
    ) {
    }

    public toString():string {
        return `MultiTouch ${this.id}`;
    }

    public addTouch(touch: Touch): void {
        this.ongoingTouches.push(touch);
        this.touches.next(touch);

        touch.frames.subscribe({
            next: async (frame) => {
                if (
                    (await touch.firstFrame).position.distance(frame.position) >=
                    5 /* TODO: to config*/
                ) {
                    this.empty = false;
                }
            },
            complete: () => {
                this.ongoingTouches = this.ongoingTouches.filter(
                    (touch2) => touch2 !== touch,
                );
                if (this.ongoingTouches.length === 0) {
                    this.touches.complete();
                }
            },
        });
    }

    public get ongoingTouchesChanges(): Observable<Touch[]> {
        return new Observable((observer: Observer<Touch[]>) => {
            this.touches.subscribe({
                next: (touch) => {
                    observer.next(this.ongoingTouches);
                    touch.frames.subscribe(
                        // !!!
                        (/*touch*/) => undefined,
                        () => undefined,
                        async () => {
                            // await forImmediate();
                            observer.next(this.ongoingTouches);
                        },
                    );
                },
                complete: () => {
                    observer.complete();
                },
            });
        });
    }

    public get ongoingPositionsChanges(): Observable<Touch[]> {
        return new Observable((observer: Observer<Touch[]>) => {
            let subscriptions: Subscription[] = [];
            this.ongoingTouchesChanges.subscribe({
                next: (touches: Touch[]) => {
                    for (const subscription of subscriptions) {
                        subscription.unsubscribe();
                    }

                    subscriptions = touches.map((touch) =>
                        touch.frames.subscribe(() => {
                            observer.next(touches);
                        }),
                    );
                },
                complete: () => {
                    observer.complete();
                },
            });
        });
    }

    public get transforms(): Observable<Transform> {
        return multiTouchTransforms(this);
        /*
            Note: Maybe in future here can be transformsTotal and transformsDelta.
        */
    }
}
