import { Observable } from 'rxjs/internal/Observable';
import { Grid } from '../Grid';
import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';

export interface ITouchController {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    applyGrid(grid: Grid): ITouchController;
}
