/*import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import Touch from './Touch';


export default class MultiTouch{

    public observable: Observable<Touch>;
    public _observer: Observer<Touch>;
    public touches: Touch[] = [];

    constructor() {
        this.observable = Observable.create((observer:Observer<Touch>)=>{
            this._observer = observer;
        });
    }

    addTouch(touch:Touch){
        this.touches.push(touch);


        touch.observable.
        touch.observable.subscribe(()=>{

            this._observer.next();
        });


        /*touch.subscribe('MOVE',()=>{
            this.callSubscribers('MOVE',touch);
        });

        touch.subscribe('END',()=>{
            this.callSubscribers('END',touch);
        });

        this.callSubscribers('START',touch);
        //todo END all
        * /

    }

}*/