import {Observable} from 'rxjs/Observable';
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/share'
import {Observer} from "rxjs/Observer";
import Touch from './Touch';
//import Vector2 from './Vector2';

//todo multitouch should be extended from this
export default class MultiTouch<TElement> {

    //public id: string;
    public ongoingTouches: Touch[] = [];
    public touches: Observable<Touch>;
    private _touchesObserver: Observer<Touch>;


    constructor(public element: TElement,//todo this should be external
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

        touch.frames.subscribe(
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

    get ongoingTouchesChanges(): Observable<Touch[]> {
        return Observable.create((observer: Observer<Touch[]>) => {
            this.touches.subscribe((touch) => {
                    observer.next(this.ongoingTouches);
                    touch.frames.subscribe((touch) => {
                        },
                        () => {
                        },
                        () => {
                            setImmediate(() => observer.next(this.ongoingTouches));
                        }
                    );
                },
                () => {
                },
                () => {
                    observer.complete();
                }
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

                    subscriptions = touches.map((touch) => touch.frames.subscribe(() => {
                        observer.next(touches)
                    }));
                },
                () => {
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    toString() {
        return `MultiTouch`;
    }
}