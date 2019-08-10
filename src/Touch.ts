import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { IElement } from './interfaces/IElement';
import { TouchFrame } from './TouchFrame';
import { Vector2 } from './Vector2';

export class Touch {
    public static Click(
        element: HTMLElement,
        anchorElement: HTMLElement,
        position: Vector2,
    ): Touch {
        const touch = new Touch(
            'MOUSE',
            anchorElement,
            new TouchFrame(element, anchorElement, position),
        );
        window.setTimeout(() => {
            touch.end();
        }, 100);
        return touch;
    }

    public frames: Observable<TouchFrame>;
    public lastFrame: TouchFrame;
    public lastFrame2: TouchFrame; // TODO: maybe function with offest
    private framesObserver: Observer<TouchFrame>;

    constructor(
        public type: 'TOUCH' | 'MOUSE', // TODO: second optional param
        public anchorElement: IElement,
        public firstFrame: TouchFrame,
    ) {
        this.lastFrame = firstFrame;
        this.lastFrame2 = firstFrame;
        this.frames = Observable.create((observer: Observer<TouchFrame>) => {
            observer.next(firstFrame); // TODO: maybe window.setImmediate(()=>
            this.framesObserver = observer;
        }).share(); // TODO: share vs publish
    }

    public move(newFrame: TouchFrame, end = false) {
        if (typeof this.framesObserver === 'undefined') {
            return; // TODO: better;
        }
        this.lastFrame2 = this.lastFrame;
        this.lastFrame = newFrame;
        this.framesObserver.next(newFrame);
        if (end) {
            this.end();
        }
    }

    public end() {
        if (this.framesObserver) {
            this.framesObserver.complete();
        }
    }

    public get start() {
        return this.firstFrame.time;
    }

    public toString() {
        return `Touch`;
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

            // if (progress < 1) {
                requestAnimationFrame(animationFrame);
            // }else{
            touch.end();
            }
        }

        requestAnimationFrame(animationFrame);
        return touch;
    }
    */
}
