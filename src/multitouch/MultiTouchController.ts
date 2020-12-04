import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BoundingBox } from 'xyzt';

import { Awaitable } from '../interfaces/Awaitable';
import { ITouchController } from '../interfaces/ITouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { MultiTouch } from './MultiTouch';

export class MultiTouchController<TElement extends BoundingBox> {
    
    public readonly multiTouches = new Subject<
        MultiTouch<TElement>
    >();
    private ongoingMultiTouches: Array<MultiTouch<TElement>> = [];

    constructor(
        public readonly touchController: ITouchController,
        private readonly elementBinder: (frame: TouchFrame) => Awaitable<TElement | undefined>,
    ) {
        this.watchNewTouchesAndPassThemToMultitouches();
    }


    private watchNewTouchesAndPassThemToMultitouches(){
        this.touchController.touches.subscribe(async (touch) => {
            const element = await this.elementBinder(await touch.firstFrame);

            let multiTouch = this.ongoingMultiTouches.find(
                (ongoingMultiTouch) => ongoingMultiTouch.element === element,
            );

            if(!multiTouch) {
                multiTouch = new MultiTouch(element);
                this.ongoingMultiTouches.push(multiTouch);
                this.multiTouches.next(multiTouch);

                multiTouch.touches.subscribe({
                    complete: () => {
                        this.ongoingMultiTouches = this.ongoingMultiTouches.filter(
                            (multiTouch2) => multiTouch2 !== multiTouch,
                        );
                    },
                });
            }
            
            // !!! await forTime(100);

            multiTouch.addTouch(touch);

        });
    }

    public get hoveredElements(): Observable<TElement | undefined> {
        return new Observable((observer) => {
            this.touchController.hoveredFrames.subscribe(async (frame) => {
                observer.next(await this.elementBinder(frame));
            });
        });
    }

    public get hoveredElementsChanges(): Observable<
        {previous?: TElement, current?:TElement}
        > {
        return new Observable(
            (observer) => {
                let previous: TElement | undefined;
                this.hoveredElements.subscribe((current) => {
                    if (previous !== current) {
                        observer.next({current, previous});
                        previous = current;
                    }
                });
            },
        );
    }

    // TODO: method for dispose
}
