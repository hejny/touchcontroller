import { IDestroyable } from 'destroyable';
import { Observable } from 'rxjs/internal/Observable';
import { Touch } from '../touch/Touch';
import { TouchFrame } from '../touch/TouchFrame';

export interface ITouchController extends IDestroyable {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
    // TODO: Delete (should be in each touchframe) applyTransform(transform: () => ITransform): ITouchController;
    // TODO: Delete (should be in each touchframe) applyGrid(grid: Grid): ITouchController;
}
