import { MultiTouch } from './MultiTouch';
import { Observable } from 'rxjs/Observable';
import { BoundingBox } from './BoundingBox';
import { Transformation } from './Transformation';
export declare function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, boundingBox?: BoundingBox): Observable<Transformation>;
