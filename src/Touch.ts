import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { share } from 'rxjs/operators';

import * as uuid from 'uuid';
import { Vector } from 'xyzt';

import { IElement } from './interfaces/IElement';
import { TouchFrame } from './TouchFrame';

let id = 0;
export class Touch {
    public static Click(
        element: HTMLElement,
        anchorElement: HTMLElement,
        position: Vector,
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

    public readonly id = id++;
    public readonly uuid = uuid.v4();
    public frames: Observable<TouchFrame>;
    public lastFrame: TouchFrame;
    public lastFrame2: TouchFrame; // TODO: maybe function with offest and better naming
    private framesObserver: Observer<TouchFrame>;

    constructor(
        // TODO: Use readonly in more places
        readonly type: 'TOUCH' | 'MOUSE', // TODO: second optional param
        readonly anchorElement: IElement,
        readonly firstFrame: TouchFrame,
        readonly buttonIdentifier?: string | number,
    ) {
        this.lastFrame = firstFrame;
        this.lastFrame2 = firstFrame;
        this.frames = new Observable((observer: Observer<TouchFrame>) => {
            observer.next(firstFrame); // TODO: maybe window.setImmediate(()=>
            this.framesObserver = observer;
        }).pipe(share()); // TODO: share vs publish
    }

    public toString() {
        return `Touch ${this.id} ${
            this.buttonIdentifier
                ? `(external id is ${this.buttonIdentifier})`
                : ''
        }`;
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

    // TODO: end method and start getter is a bit confusing
    public end() {
        if (this.framesObserver) {
            this.framesObserver.complete();
        }
    }

    // TODO: end method and start getter is a bit confusing
    public get start() {
        return this.firstFrame.time;
    }

    /*
    todo maybe
    static Rotate(position: Vector, rotation:number): Touch {
        const touch = new Touch('MOUSE', new TouchFrame(position));
        setTimeout(() => {
            touch.move(new TouchFrame(position,undefined,rotation),true);
        }, 100);
        return touch;
    }

    /*todo
    static Drag(position1: Vector, position2: Vector, duration: number): Touch {
        const touch = new Touch('MOUSE', new TouchFrame(position1));

        const startTime = performance.now();

        function animationFrame(now: number) {

            const progress = Math.max((now - startTime) / duration, 1);

            const position = Vector.add(position1.scale(1 - progress), position2.scale(progress));
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
