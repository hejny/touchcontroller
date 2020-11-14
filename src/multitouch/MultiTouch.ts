import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observer } from 'rxjs/internal/types';
import { share } from 'rxjs/operators';
import * as uuid from 'uuid';
import { Transform } from 'xyzt';

import { Touch } from '../touch/Touch';
import { multiTouchTransforms } from './multiTouchTransforms';

let id = 0;
export class MultiTouch<TElement> {
    public readonly id = id++;
    public readonly uuid = uuid.v4();
    public empty: boolean = true;
    public ongoingTouches: Touch[] = [];
    public touches: Observable<Touch>;

    private touchesObserver: Observer<Touch>;

    constructor(
        public element: TElement, // TODO: this should be external
        public firstTouch: Touch,
    ) {
        this.touches = new Observable((observer: Observer<Touch>) => {
            (async () => {
                this.touchesObserver = observer;
                // await forImmediate();
                this.addTouch(firstTouch);
            })();
        }).pipe(share());
    }

    public toString() {
        return `MultiTouch ${this.id}`;
    }

    public addTouch(touch: Touch) {
        this.ongoingTouches.push(touch);
        this.touchesObserver.next(touch);

        touch.frames.subscribe(
            (frame) => {
                if (
                    touch.firstFrame.position.distance(frame.position) >=
                    5 /*todo to config*/
                ) {
                    this.empty = false;
                }
            },
            () => {
                // TODO: is empty functions needed - if yes create empty function in tools
            },
            () => {
                this.ongoingTouches = this.ongoingTouches.filter(
                    (touch2) => touch2 !== touch,
                );
                if (this.ongoingTouches.length === 0) {
                    this.touchesObserver.complete();
                }
            },
        );
    }

    public get ongoingTouchesChanges(): Observable<Touch[]> {
        return new Observable((observer: Observer<Touch[]>) => {
            this.touches.subscribe(
                (touch) => {
                    observer.next(this.ongoingTouches);
                    touch.frames.subscribe(
                        (/*touch*/) => undefined,
                        () => undefined,
                        /*async */ () => {
                            // await forImmediate();
                            observer.next(this.ongoingTouches);
                        },
                    );
                },
                () => undefined,
                () => {
                    observer.complete();
                },
            );
        });
    }

    public get ongoingPositionsChanges(): Observable<Touch[]> {
        return new Observable((observer: Observer<Touch[]>) => {
            let subscriptions: Subscription[] = [];
            this.ongoingTouchesChanges.subscribe(
                (touches: Touch[]) => {
                    for (const subscription of subscriptions) {
                        subscription.unsubscribe();
                    }

                    subscriptions = touches.map((touch) =>
                        touch.frames.subscribe(() => {
                            observer.next(touches);
                        }),
                    );
                },
                () => undefined,
                () => {
                    observer.complete();
                },
            );
        });
    }

    public get transforms(): Observable<Transform> {
        return multiTouchTransforms(this);
        /*
            Note: Maybe in future here can be transformsTotal and transformsDelta.
        */
    }
}
