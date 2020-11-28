import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Observer } from 'rxjs/internal/types';
import { BoundingBox } from 'xyzt';
import { ITouchController } from '../interfaces/ITouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { MultiTouch } from './MultiTouch';

export class MultiTouchController<TElement extends BoundingBox> {
    public ongoingMultiTouches: Array<MultiTouch<TElement>> = []; // TODO: null vs. undefined
    public readonly multiTouches = new Subject<
        MultiTouch<TElement>
    >();

    constructor(
        public touchController: ITouchController,
        private elementBinder: (frame: TouchFrame) => TElement | undefined, // TODO: maybe rename private properties - remove _
    ) {
        this.touchController.touches.subscribe(async (touch) => {
            const element = this.elementBinder(await touch.firstFrame);

            // TODO: why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter(
                (ongoingMultiTouch) => ongoingMultiTouch.element === element,
            )[0];

            if (typeof multiTouch === 'undefined') {
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);
                this.multiTouches.next(multiTouch);

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
