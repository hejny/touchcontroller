import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { share } from 'rxjs/operators';

import { ITouchController } from './interfaces/ITouchController';
import { MultiTouch } from './MultiTouch';
import { TouchFrame } from './TouchFrame';

export class MultiTouchController<TElement> {
    public ongoingMultiTouches: Array<MultiTouch<TElement | undefined>> = []; // TODO: null vs. undefined
    public multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private multiTouchesObserver: Observer<MultiTouch<TElement | undefined>>;

    constructor(
        public touchController: ITouchController,
        private elementBinder: (frame: TouchFrame) => TElement | undefined, // TODO: maybe rename private properties - remove _
    ) {
        this.multiTouches = new Observable(
            (observer: Observer<MultiTouch<TElement | undefined>>) => {
                this.multiTouchesObserver = observer;
            },
        ).pipe(share());

        this.touchController.touches.subscribe((touch) => {
            const element = this.elementBinder(touch.firstFrame);

            // TODO: why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter(
                (ongoingMultiTouch) => ongoingMultiTouch.element === element,
            )[0];

            if (typeof multiTouch === 'undefined') {
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);
                this.multiTouchesObserver.next(multiTouch);

                multiTouch.touches.subscribe(
                    () => undefined,
                    () => undefined,
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
        return new Observable((observer: Observer<TElement | undefined>) => {
            this.touchController.hoveredFrames.subscribe((frame) => {
                observer.next(this.elementBinder(frame));
            });
        });
    }

    public get hoveredElementsChanges(): Observable<
        [TElement | undefined, TElement | undefined]
    > {
        return new Observable(
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
