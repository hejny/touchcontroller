import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import {Observer} from "rxjs/Observer";
import Touch from './Touch';


export default class MultiTouch {

    public ongoingTouches: Touch[] = [];
    public touches: Observable<Touch>;
    private _touchesObserver: Observer<Touch>;


    constructor(public firstTouch: Touch) {
        this.touches = Observable.create((observer: Observer<Touch>) => {
            this._touchesObserver = observer;
            this.addTouch(firstTouch);
        });
    }

    addTouch(touch: Touch) {
        //console.log(this.touches.);
        this.ongoingTouches.push(touch);
        this._touchesObserver.next(touch);


        console.log('------------------------------Adding Touch to MultiTouch');
        touch.positions.subscribe(
            (position) => {
                console.log("Touch in multitouch next().");
                this._touchesObserver.next(touch);
            },
            () => {
                //console.log("Touch in multitouch error.");
            },
            () => {
                console.log("Touch in multitouch is complete.");
                this.ongoingTouches = this.ongoingTouches.filter((touch2) => touch2 !== touch);
                this._touchesObserver.complete();
            });
    }
}