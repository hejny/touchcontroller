import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BoundingBox } from 'xyzt';
import { Awaitable } from '../interfaces/Awaitable';
import { ITouchController } from '../interfaces/ITouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { Multitouch } from './Multitouch';


export class MultitouchController<TElement extends BoundingBox> {
    
    public readonly multitouches = new Subject<
        Multitouch<TElement>
    >();
    private ongoingMultitouches: Array<Multitouch<TElement>> = [];

    constructor(
        public readonly touchController: ITouchController,
        private readonly elementBinder: (frame: TouchFrame) => Awaitable<TElement | undefined>,
    ) {
        this.watchNewTouchesAndPassThemToMultitouches();
    }


    private watchNewTouchesAndPassThemToMultitouches(){
        this.touchController.touches.subscribe(async (touch) => {
            const element = await this.elementBinder(await touch.firstFrame);

            let multitouch = this.ongoingMultitouches.find(
                (ongoingMultitouch) => ongoingMultitouch.element === element,
            );

            if(!multitouch) {
                multitouch = new Multitouch(element);
                this.ongoingMultitouches.push(multitouch);
                this.multitouches.next(multitouch);

                multitouch.touches.subscribe({
                    complete: () => {
                        this.ongoingMultitouches = this.ongoingMultitouches.filter(
                            (multitouch2) => multitouch2 !== multitouch,
                        );
                    },
                });
            }
            
            // !!! await forTime(100);

            multitouch.addTouch(touch);

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
