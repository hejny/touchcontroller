import { Observable } from 'rxjs/internal/Observable';
import { Touch } from '../touch/Touch';
import { TouchFrame } from '../touch/TouchFrame';

export interface ITouchController {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    // TODO: applyGrid(grid: Grid): ITouchController;
}
