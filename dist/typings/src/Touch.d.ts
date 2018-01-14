import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import TouchFrame from './TouchFrame';
export default class Touch {
    type: 'TOUCH' | 'MOUSE';
    firstFrame: TouchFrame;
    frames: Observable<TouchFrame>;
    private _framesObserver;
    lastFrame: TouchFrame;
    lastFrame2: TouchFrame;
    constructor(type: 'TOUCH' | 'MOUSE', firstFrame: TouchFrame);
    move(newFrame: TouchFrame, end?: boolean): void;
    end(): void;
    readonly start: number;
    toString(): string;
}
