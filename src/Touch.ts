import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share'
import {Observer} from "rxjs/Observer";
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share'
//import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TouchFrame from './TouchFrame';

export default class Touch {

    //public uuid: string;
    public frames: Observable<TouchFrame>;
    private _framesObserver: Observer<TouchFrame>;
    public lastFrame: TouchFrame;
    public lastFrame2: TouchFrame;//todo maybe function with offest

    constructor(//public touchController: TouchController,
                //public id: number,
                //public eventId: string,//todo this should be external id only in controller
                public type: 'TOUCH' | 'MOUSE',
                public firstFrame: TouchFrame

    ) {
        this.lastFrame = firstFrame;
        this.lastFrame2 = firstFrame;
        this.frames = Observable.create((observer: Observer<TouchFrame>) => {
            observer.next(firstFrame);//todo maybe setImmediate(()=>
            this._framesObserver = observer;
        }).share();//todo share vs publish
    }

    move(newFrame: TouchFrame, end = false) {
        if(typeof this._framesObserver === 'undefined'){
            return;//todo better;
        }
        this.lastFrame2 = this.lastFrame;
        this.lastFrame = newFrame;
        this._framesObserver.next(newFrame);
        if (end) {
            this.end();
        }
    }

    end(){
        this._framesObserver.complete();
    }

    get start() {
        return this.firstFrame.time;
    }

    toString() {
        //return `Touch(${this.id})`
        return `Touch`
    }

}