import { forImmediate, forValueDefined } from 'waitasecond';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { BoundingBox } from './BoundingBox';
import { multiTouchTransformations } from './multiTouchTransformations';
import { Touch } from './Touch';
import { Transformation } from './Transformation';

//todo multitouch should be extended from this
export class MultiTouch<TElement> {
    public empty: boolean = true;
    public ongoingTouches: Touch[] = [];
    public touches: Observable<Touch>;
    private _touchesObserver?: Observer<Touch>;

    constructor(
        public element: TElement, //todo this should be external
        public firstTouch: Touch,
    ) {
        this.touches = Observable.create(async (observer: Observer<Touch>) => {
            this._touchesObserver = observer;
            await forImmediate();
            this.addTouch(firstTouch);
        }).share();
    }

    async addTouch(touch: Touch) {
        this.ongoingTouches.push(touch);
        const touchesObserver = await forValueDefined(()=>this._touchesObserver);
        touchesObserver.next(touch);

        touch.frames.subscribe(
            (frame) => {
                if (
                    touch.firstFrame.position.length(frame.position) >=
                    5 /*todo to config*/
                ) {
                    this.empty = false;
                }
            },
            () => {
                //todo is empty functions needed - if yes create empty function in tools
            },
            () => {
                this.ongoingTouches = this.ongoingTouches.filter(
                    (touch2) => touch2 !== touch,
                );
                if (this.ongoingTouches.length === 0) {
                    touchesObserver.complete();
                }
            },
        );
    }

    get ongoingTouchesChanges(): Observable<Touch[]> {
        return Observable.create((observer: Observer<Touch[]>) => {
            this.touches.subscribe(
                (touch) => {
                    observer.next(this.ongoingTouches);
                    touch.frames.subscribe(
                        () => {},
                        () => {},
                        () => {
                            setImmediate(() =>
                                observer.next(this.ongoingTouches),
                            );
                        },
                    );
                },
                () => {},
                () => {
                    observer.complete();
                },
            );
        });
    }

    get ongoingPositionsChanges(): Observable<Touch[]> {
        return Observable.create((observer: Observer<Touch[]>) => {
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
                () => {},
                () => {
                    observer.complete();
                },
            );
        });
    }

    transformations(
        boundingBox: BoundingBox = BoundingBox.One(),
    ): Observable<Transformation> {
        return multiTouchTransformations(this, boundingBox);
    }

    toString() {
        return `MultiTouch`;
    }
}
