//import * as uuidv4 from 'uuid/v4';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share'
import {Observer} from "rxjs/Observer";
import Touch from './Touch';


export default class MultiTouch<TElement> {

    //public id: string;
    public ongoingTouches: Touch[] = [];
    public touches: Observable<Touch>;
    private _touchesObserver: Observer<Touch>;


    constructor(public id: number,
                public element: TElement,
                public firstTouch: Touch) {
        //this.id = uuidv4();
        this.touches = Observable.create((observer: Observer<Touch>) => {
            this._touchesObserver = observer;
            this.addTouch(firstTouch);
        }).share();
        //console.log(`------------------------------Creating ${this} `);
    }

    addTouch(touch: Touch) {
        //console.log(this.touches.);
        this.ongoingTouches.push(touch);
        this._touchesObserver.next(touch);

        //console.log(`Adding ${touch} To ${this}.`);

        touch.positions.subscribe(
            (position) => {
                //console.log(`Next ${touch} in ${this}.`);
                //this._touchesObserver.next(touch);
            },
            () => {
                //console.log("Touch in multitouch error.");
            },
            () => {
                //console.log(`Complete ${touch} in ${this}.`);
                this.ongoingTouches = this.ongoingTouches.filter((touch2) => touch2 !== touch);
                if (this.ongoingTouches.length === 0) {
                    this._touchesObserver.complete();
                }
            });
    }

    toString() {
        return `MultiTouch(${this.id})`
    }
}