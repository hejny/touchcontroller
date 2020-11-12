import { Observable } from 'rxjs/internal/Observable';
import { Grid } from '../touch/Grid';
import { Touch } from '../touch/Touch';
import { TouchFrame } from '../TouchFrame';

export interface ITouchController {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    applyGrid(grid: Grid): ITouchController;
}
