import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
//import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';


export default class Touch{

    public positions: Observable<TimeVector2>;
    public _observer: Observer<TimeVector2>;
    //private _finished: boolean = false;
    //public positions: TimeVector2[];

    constructor(public id: string,
                public type: 'TOUCH' | 'MOUSE',
                firstPosition: TimeVector2) {
        //this.positions = [firstPosition];
        this.positions = Observable.create((observer:Observer<TimeVector2>)=>{
            observer.next(firstPosition);
            this._observer = observer;
        });
    }

    move(newPoint: TimeVector2, end = false) {
        this._observer.next(newPoint);
        if(end){
            this._observer.complete();
        }
        /*if (!end) {
            this._observer.next(newPoint);
            //this.callSubscribers('MOVE', newPoint);
        } else {
            this._finished = true;
            this._observer.next(newPoint);
            //this.callSubscribers('END', newPoint);
        }*/
    }

    get firstPosition() {
        return this.positions[0];
    }

    get start() {
        return this.firstPosition.t;
    }

    /*get finished() {
        return this._finished;
    }*/

}