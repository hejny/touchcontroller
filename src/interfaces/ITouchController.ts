import { Observable } from 'rxjs/Observable';
import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';
import { Grid } from '../Grid';

export interface ITouchController {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    applyGrid(grid: Grid): ITouchController;
}
