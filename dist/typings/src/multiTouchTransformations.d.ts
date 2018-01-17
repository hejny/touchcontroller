import { Observable } from 'rxjs/Observable';
import MultiTouch from './MultiTouch';
import Transformation from './Transformation';
import BoundingBox from './BoundingBox';
export default function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, boundingBox?: BoundingBox): Observable<Transformation>;
