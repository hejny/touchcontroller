import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import TouchFrame from './TouchFrame';
import Vector2 from './Vector2';

export default class Touch {
    public frames: Observable<TouchFrame>;
    private _framesObserver: Observer<TouchFrame>;
    public lastFrame: TouchFrame;
    public lastFrame2: TouchFrame; //todo maybe function with offest

    constructor(
        public type: 'TOUCH' | 'MOUSE', //todo second optional param
        public anchorElement: HTMLElement,
        public firstFrame: TouchFrame,
    ) {
        this.lastFrame = firstFrame;
        this.lastFrame2 = firstFrame;
        this.frames = Observable.create((observer: Observer<TouchFrame>) => {
            observer.next(firstFrame); //todo maybe setImmediate(()=>
            this._framesObserver = observer;
        }).share(); //todo share vs publish
    }

    move(newFrame: TouchFrame, end = false) {
        if (typeof this._framesObserver === 'undefined') {
            return; //todo better;
        }
        this.lastFrame2 = this.lastFrame;
        this.lastFrame = newFrame;
        this._framesObserver.next(newFrame);
        if (end) {
            this.end();
        }
    }

    end() {
        this._framesObserver.complete();
    }

    get start() {
        return this.firstFrame.time;
    }

    toString() {
        return `Touch`;
    }

    static Click(
        element: HTMLElement,
        anchorElement: HTMLElement,
        position: Vector2,
    ): Touch {
        const touch = new Touch(
            'MOUSE',
            anchorElement,
            new TouchFrame(element, anchorElement, position),
        );
        setTimeout(() => {
            touch.end();
        }, 100);
        return touch;
    }

    /*
    todo maybe
    static Rotate(position: Vector2, rotation:number): Touch {
        const touch = new Touch('MOUSE', new TouchFrame(position));
        setTimeout(() => {
            touch.move(new TouchFrame(position,undefined,rotation),true);
        }, 100);
        return touch;
    }

    /*todo
    static Drag(position1: Vector2, position2: Vector2, duration: number): Touch {
        const touch = new Touch('MOUSE', new TouchFrame(position1));

        const startTime = performance.now();

        function animationFrame(now: number) {

            const progress = Math.max((now - startTime) / duration, 1);

            const position = Vector2.add(position1.scale(1 - progress), position2.scale(progress));
            touch.move(new TouchFrame(position));

            console.log(progress,position);

            //if (progress < 1) {
                requestAnimationFrame(animationFrame);
            //}else{
            touch.end();
            }
        }

        requestAnimationFrame(animationFrame);
        return touch;
    }
    */
}
