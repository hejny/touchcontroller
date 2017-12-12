import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import Touch from './Touch';


export default class MultiTouch{

    public touches: Observable<Touch>;
    private _touchesObserver: Observer<Touch>;

    constructor(public firstTouch: Touch) {
        this.touches = Observable.create((observer:Observer<Touch>)=>{
            observer.next(firstTouch);
            this._touchesObserver = observer;
        });
    }

    addTouch(touch:Touch){
        //console.log(this.touches.);
        this._touchesObserver.next(touch);


        touch.positions.subscribe((position)=>{
            this._touchesObserver.next(touch);
        });





        /*touch.subscribe('MOVE',()=>{
            this.callSubscribers('MOVE',touch);
        });

        touch.subscribe('END',()=>{
            this.callSubscribers('END',touch);
        });

        this.callSubscribers('START',touch);
        //todo END all
        */

    }

}