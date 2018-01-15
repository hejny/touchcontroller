import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share'
import {Observer} from "rxjs/Observer";
import TouchController from './TouchController';
import Touch from './Touch';
import MultiTouch from './MultiTouch';
import Vector2 from './Vector2';

export default class MultiTouchController<TElement> {

    public ongoingMultiTouches: MultiTouch<TElement | undefined>[] = [];
    public multiTouches: Observable<MultiTouch<TElement | undefined>>;
    private _multiTouchesObserver: Observer<MultiTouch<TElement | undefined>>;

    constructor(private _touchController: TouchController,
                private _elementBinder: (position: Vector2) => TElement | undefined) {

        this.multiTouches = Observable.create((observer: Observer<MultiTouch<TElement | undefined>>) => {
            this._multiTouchesObserver = observer;
        }).share();

        this._touchController.touches.subscribe((touch) => {

            const element = this._elementBinder(touch.firstFrame.position);

            //todo why can not be used find
            let multiTouch = this.ongoingMultiTouches.filter((multiTouch) => multiTouch.element === element)[0];

            if (typeof multiTouch === 'undefined') {

                //console.log('creating new multitouch');
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

    emulateTouch(touch: Touch){
        this._touchController.emulateTouch(touch);
    }

    //todo dispose


}
