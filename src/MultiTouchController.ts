import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { MultiTouch } from './MultiTouch';
import { TouchController } from './TouchController';
import { TouchFrame } from './TouchFrame';

export class MultiTouchController<TElement> {
    public ongoingMultiTouches: MultiTouch<TElement | undefined>[] = []; // TODO: null vs. undefined
    public multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private multiTouchesObserver: Observer<MultiTouch<TElement | undefined>>;

    constructor(
        public touchController: TouchController,
        private elementBinder: (frame: TouchFrame) => TElement | undefined, // TODO: maybe rename private properties - remove _
    ) {
        this.multiTouches = Observable.create(
            (observer: Observer<MultiTouch<TElement | undefined>>) => {
                this.multiTouchesObserver = observer;
            },
        ).share();

        this.touchController.touches.subscribe((touch) => {
            const element = this.elementBinder(touch.firstFrame);

            // TODO: why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter(
                (multiTouch) => multiTouch.element === element,
            )[0];

            if (typeof multiTouch === 'undefined') {
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);
                this.multiTouchesObserver.next(multiTouch);

                multiTouch.touches.subscribe(
                    () => {},
                    () => {},
                    () => {
                        this.ongoingMultiTouches = this.ongoingMultiTouches.filter(
                            (multiTouch2) => multiTouch2 !== multiTouch,
                        );
                    },
                );
            } else {
                multiTouch.addTouch(touch);
            }
        });
    }

    public get hoveredElements(): Observable<TElement | undefined> {
        return Observable.create((observer: Observer<TElement | undefined>) => {
            this.touchController.hoveredFrames.subscribe((frame) => {
                observer.next(this.elementBinder(frame));
            });
        });
    }

    public get hoveredElementsChanges(): Observable<
        [TElement | undefined, TElement | undefined]
    > {
        return Observable.create(
            (
                observer: Observer<
                    [TElement | undefined, TElement | undefined]
                >,
            ) => {
                let lastElement: TElement | undefined;
                this.hoveredElements.subscribe((thisElement) => {
                    if (lastElement !== thisElement) {
                        observer.next([thisElement, lastElement]);
                        lastElement = thisElement;
                    }
                });
            },
        );
    }

    // TODO: method for dispose
}
