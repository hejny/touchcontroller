//import * as uuidv4 from 'uuid/v4';
import TouchController from './TouchController';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share'
import {Observer} from "rxjs/Observer";
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share'
//import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';

export default class Touch {

    //public uuid: string;
    public positions: Observable<TimeVector2>;
    private _positionsObserver: Observer<TimeVector2>;
    public lastPosition: TimeVector2;
    //private _finished: boolean = false;
    //public positions: TimeVector2[];

    constructor(public touchController: TouchController,
                public id: number,
                public eventId: string,//todo this should be external id only in controller
                public type: 'TOUCH' | 'MOUSE',
                public firstPosition: TimeVector2) {
        this.lastPosition = firstPosition;
        this.positions = Observable.create((observer: Observer<TimeVector2>) => {
            observer.next(firstPosition);
            this._positionsObserver = observer;
        }).share();//todo share vs publish
    }

    move(newPosition: TimeVector2, end = false) {
        if(typeof this._positionsObserver === 'undefined'){
            return;//todo better;
        }
        this.lastPosition = newPosition;
        this._positionsObserver.next(newPosition);
        if (end) {
            this._positionsObserver.complete();

        }
    }

    get start() {
        return this.firstPosition.t;
    }

    toString() {
        return `Touch(${this.id})`
    }

}