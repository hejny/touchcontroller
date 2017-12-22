import { Observable } from 'rxjs/Observable';
import MultiTouch from './MultiTouch';
import Transformation from './Transformation';
export default function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, objectTransformation?: Transformation): Observable<Transformation>;
