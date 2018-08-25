import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { Observer } from 'rxjs/Observer';
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import TouchFrame from './TouchFrame';

export default class MultiTouchController<TElement> {
    public ongoingMultiTouches: MultiTouch<TElement | undefined>[] = []; //todo null vs. undefined
    public multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private _multiTouchesObserver: Observer<MultiTouch<TElement | undefined>>;

    constructor(
        public touchController: TouchController,
        private _elementBinder: (frame: TouchFrame) => TElement | undefined, //todo maybe rename private properties - remove _
    ) {
        this.multiTouches = Observable.create(
            (observer: Observer<MultiTouch<TElement | undefined>>) => {
                this._multiTouchesObserver = observer;
            },
        ).share();

        this.touchController.touches.subscribe((touch) => {
            const element = this._elementBinder(touch.firstFrame);

            //todo why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter(
                (multiTouch) => multiTouch.element === element,
            )[0];

            if (typeof multiTouch === 'undefined') {
                //console.log('creating new multitouch');
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);
                this._multiTouchesObserver.next(multiTouch);

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

    //todo dispose
}
