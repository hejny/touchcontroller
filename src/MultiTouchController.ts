import '../node_modules/rxjs/add/operator/share';
import { Observable } from '../node_modules/rxjs/Observable';
import { Observer } from '../node_modules/rxjs/Observer';
import { MultiTouch } from './MultiTouch';
import { TouchController } from './TouchController';
import { TouchFrame } from './TouchFrame';
import { forValueDefined } from '../node_modules/waitasecond/dist/index';

export class MultiTouchController<TElement> {
    public ongoingMultiTouches: MultiTouch<TElement | undefined>[] = []; //todo null vs. undefined
    public multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private _multiTouchesObserver?: Observer<MultiTouch<TElement | undefined>>;

    constructor(
        public touchController: TouchController,
        private _elementBinder: (frame: TouchFrame) => TElement | undefined, //todo maybe rename private properties - remove _
    ) {
        this.multiTouches = Observable.create(
            (observer: Observer<MultiTouch<TElement | undefined>>) => {
                this._multiTouchesObserver = observer;
            },
        ).share();

        this.touchController.touches.subscribe(async (touch) => {
            const element = this._elementBinder(touch.firstFrame);

            //todo why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter(
                (multiTouch) => multiTouch.element === element,
            )[0];

            if (typeof multiTouch === 'undefined') {
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);

                const multiTouchesObserver = await forValueDefined(()=>this._multiTouchesObserver);
                multiTouchesObserver.next(multiTouch);

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

    get hoveredElements(): Observable<TElement | undefined> {
        return Observable.create((observer: Observer<TElement | undefined>) => {
            this.touchController.hoveredFrames.subscribe((frame) => {
                observer.next(this._elementBinder(frame));
            });
        });
    }

    get hoveredElementsChanges(): Observable<
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

    //todo method for dispose
}
