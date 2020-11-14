import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { share } from 'rxjs/operators';
import { ITouchController } from '../interfaces/ITouchController';
import { Grid } from './Grid';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

export class GridTouchController implements ITouchController {
    public touches: Observable<Touch>;
    public hoveredFrames: Observable<TouchFrame>;

    private touchesObserver: Observer<Touch>;
    // TODO: private hoveredFramesObserver: Observer<TouchFrame>;

    constructor(touchController: ITouchController, grid: Grid) {
        this.touches = new Observable((observer: Observer<Touch>) => {
            this.touchesObserver = observer;
        }).pipe(share());

        this.hoveredFrames = new Observable(
            (observer: Observer<TouchFrame>) => {
                // TODO: this.hoveredFramesObserver = observer;
            },
        ).pipe(share());

        // TODO: Now there are hoveredFrames not working - make a switcher if they should work

        touchController.touches.subscribe(
            (touch) => {
                const gridTouch = grid.applyToTouch(touch);
                this.touchesObserver.next(gridTouch);
            } /* Note: Touches cound not end */,
        );
    }

    public applyGrid(grid: Grid): GridTouchController {
        return grid.applyToTouchController(this);
    }
}
