import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { BoundingBox } from 'xyzt';
import { IAwaitable } from '../interfaces/IAwaitable';
import { IDestroyable } from '../interfaces/IDestroyable';
import { ITouchController } from '../interfaces/ITouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { Destroyable } from '../utils/Destroyable';
import { WithOptional } from '../utils/WithOptional';
import { Multitouch } from './Multitouch';

interface IMultitouchControllerOptions<TElement extends BoundingBox> {
    touchController: ITouchController;
    elementBinder: (frame: TouchFrame) => IAwaitable<TElement | undefined>;
}

const multitouchControllerOptionsDefault = {
    elementBinder: () => undefined,
};

export class MultitouchController<TElement extends BoundingBox> extends Destroyable implements IDestroyable {
    public readonly touchController: ITouchController;
    public readonly multitouches = new Subject<Multitouch<TElement>>();
    private ongoingMultitouches: Array<Multitouch<TElement>> = [];
    private readonly elementBinder: (frame: TouchFrame) => IAwaitable<TElement | undefined>;

    constructor(
        options: WithOptional<IMultitouchControllerOptions<TElement>, keyof typeof multitouchControllerOptionsDefault>,
    ) {
        super();
        const { touchController, elementBinder } = {
            ...multitouchControllerOptionsDefault,
            ...options,
        };

        this.touchController = touchController;
        this.elementBinder = elementBinder;
        this.watchNewTouchesAndPassThemToMultitouches();
    }

    private watchNewTouchesAndPassThemToMultitouches() {
        this.touchController.touches.subscribe(async (touch) => {
            const element = await this.elementBinder(await touch.firstFrame);

            let multitouch = this.ongoingMultitouches.find(
                (ongoingMultitouch) => ongoingMultitouch.element === element,
            );

            if (!multitouch) {
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

    public get hoveredElementsChanges(): Observable<{ previous?: TElement; current?: TElement }> {
        return new Observable((observer) => {
            let previous: TElement | undefined;
            this.hoveredElements.subscribe((current) => {
                if (previous !== current) {
                    observer.next({ current, previous });
                    previous = current;
                }
            });
        });
    }

    public async destroy(): Promise<void> {
        super.destroy();
        // TODO: Implement and really destroy things constructed and created here really destroy subscriptions created here
        // TODO: Use in methods this.checkWhetherNotDestroyed
    }
}
