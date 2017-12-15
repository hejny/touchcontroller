import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Vector2 from './Vector2';


export default class MultiTouchController<TElement> {

    public ongoingMultiTouches: MultiTouch<TElement>[] = [];
    public multiTouches: Observable<MultiTouch<TElement>>;
    private _multiTouchesObserver: Observer<MultiTouch<TElement>>;

    constructor(private _touchController: TouchController,
                private _elementBinder: (position: Vector2) => TElement) {

        this.multiTouches = Observable.create((observer: Observer<MultiTouch<TElement>>) => {
            this._multiTouchesObserver = observer;
        });

        this._touchController.touches.subscribe((touch) => {

            const element = this._elementBinder(touch.firstPosition);
            //todo why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter((multiTouch) => multiTouch.element === element)[0];

            if (typeof multiTouch === 'undefined') {

                console.log('creating new multitouch');
                multiTouch = new MultiTouch(element, touch);
                this.ongoingMultiTouches.push(multiTouch);
                this._multiTouchesObserver.next(multiTouch);

                multiTouch.touches.subscribe(
                    () => {
                    },
                    () => {
                    },
                    () => {
                        this.ongoingMultiTouches = this.ongoingMultiTouches.filter((multiTouch2) => multiTouch2 !== multiTouch);
                    }
                );

            } else {
                multiTouch.addTouch(touch);
            }

        });
    }


}
