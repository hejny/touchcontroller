import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import * as uuid from 'uuid';
import { forImmediate } from 'waitasecond';
import { Touch } from '../touch/Touch';

let id = 0;
export class Multitouch<TElement> {
    public readonly id = id++;
    public readonly uuid = uuid.v4(); // TODO: Do we really need uuid
    public ongoingTouches: Touch[] = [];
    public readonly touches = new Subject<Touch>();

    constructor(public element?: TElement) {}

    public toString(): string {
        return `Multitouch ${this.id}`;
    }

    public addTouch(touch: Touch): void {
        this.ongoingTouches.push(touch);
        this.touches.next(touch);

        touch.frames.subscribe({
            complete: () => {
                this.ongoingTouches = this.ongoingTouches.filter((touch2) => touch2 !== touch);
                if (this.ongoingTouches.length === 0) {
                    this.touches.complete();
                    // TODO: !!! Maybe destroy here
                }
            },
        });
    }

    /**
     * Get RxJS Observable array which every item is list of touches
     * For example when user scale object by two fingers it will be:
     * [[finger1]],[[finger1,finger2]],[[finger1]]
     */
    public get ongoingTouchesChanges(): Observable<Touch[]> {
        return new Observable((observer) => {
            this.touches.subscribe({
                next: (touch) => {
                    observer.next(this.ongoingTouches);

                    // Watch when this touch is complete and then again update the ongoingTouches
                    touch.frames.subscribe({
                        complete: async () => {
                            await forImmediate(/* To ensure that this.ongoingTouches is updated */);
                            observer.next(this.ongoingTouches);
                        },
                    });
                },
                complete: () => {
                    observer.complete();
                },
            });
        });
    }

    // TODO: !!! Destoroy
}
