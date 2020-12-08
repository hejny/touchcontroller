import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform } from 'xyzt';
import { Multitouch } from '../Multitouch';
import { multitouchTransforms } from './multitouchTransforms';

export function multitouchTransformsOnElement(multitouch: Multitouch<BoundingBox>): Observable<Transform> {
    return multitouch.element ? multitouchTransforms(multitouch, () => multitouch.element!.center) : new Observable();
}
