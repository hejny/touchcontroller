import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import 'rxjs/add/observable/range';

//import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';

export default class Touch{

    public positions: Observable<TimeVector2>;
    private _positionsObserver: Observer<TimeVector2>;
    public lastPosition: TimeVector2;
    //private _finished: boolean = false;
    //public positions: TimeVector2[];

    constructor(public id: string,
                public type: 'TOUCH' | 'MOUSE',
                public firstPosition: TimeVector2) {
        //this.positions = [firstPosition];
        this.positions = Observable.create((observer:Observer<TimeVector2>)=>{
            this.lastPosition = firstPosition;
            observer.next(firstPosition);
            this._positionsObserver = observer;
            setTimeout(()=>{
                observer.next(firstPosition);
            },1000);


        });
    }

    move(newPosition: TimeVector2, end = false) {
        this.lastPosition = newPosition;
        //this._positionsObserver.next(newPosition);
        if(end){
            //console.log('completing touch');
            //todo When I call next just before complete complete is not working.
            //this._positionsObserver.next(newPosition);
            this._positionsObserver.complete();

        }else{
            this._positionsObserver.next(newPosition);
        }
    }

    get start() {
        return this.firstPosition.t;
    }

}