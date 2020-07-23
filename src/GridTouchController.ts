import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Grid } from './Grid';
import { ITouchController } from './interfaces/ITouchController';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

export class GridTouchController implements ITouchController {
    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;

    private touchesObserver: Observer<Touch>;
    // TODO: private hoveredFramesObserver: Observer<TouchFrame>;

    constructor(touchController: ITouchController, grid: Grid) {
        this.touches = Observable.create((observer: Observer<Touch>) => {
            this.touchesObserver = observer;
        }).share();

        this.hoveredFrames = Observable.create(
            (observer: Observer<TouchFrame>) => {
                // TODO: this.hoveredFramesObserver = observer;
            },
        ).share();

        // TODO: Now there are hoveredFrames not working - make a switcher if they should work

        touchController.touches.subscribe(
            (touch) => {
                const gridTouch = grid.applyToTouch(touch);
                this.touchesObserver.next(gridTouch);
            } /* Note: Touches cound not end */,
        );
    }
}
