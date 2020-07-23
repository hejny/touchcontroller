import { Observable } from 'rxjs/Observable';
import { Touch } from '../Touch';
import { TouchFrame } from '../TouchFrame';

export interface ITouchController {
    touches: Observable<Touch>;
    hoveredFrames: Observable<TouchFrame>;
}
