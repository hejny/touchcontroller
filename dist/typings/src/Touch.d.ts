import { Vector2 } from './Vector2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/share';
import { TouchFrame } from './TouchFrame';
export declare class Touch {
    type: 'TOUCH' | 'MOUSE';
    anchorElement: HTMLElement;
    firstFrame: TouchFrame;
    frames: Observable<TouchFrame>;
    private _framesObserver;
    lastFrame: TouchFrame;
    lastFrame2: TouchFrame;
    constructor(type: 'TOUCH' | 'MOUSE', anchorElement: HTMLElement, firstFrame: TouchFrame);
    move(newFrame: TouchFrame, end?: boolean): void;
    end(): void;
    readonly start: number;
    toString(): string;
    static Click(element: HTMLElement, anchorElement: HTMLElement, position: Vector2): Touch;
}
