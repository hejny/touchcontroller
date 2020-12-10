import { Observable } from 'rxjs/internal/Observable';
import { BoundingBox, Transform } from 'xyzt';
import { Multitouch } from '../Multitouch';
import { multitouchTransforms } from './multitouchTransforms';

interface IMultitouchTransformsOnElementOptions {
    multitouch: Multitouch<BoundingBox>;
}

export function multitouchTransformsOnElement({
    multitouch,
}: IMultitouchTransformsOnElementOptions): Observable<Transform> {
    return multitouch.element
        ? multitouchTransforms({ multitouch, getElementCenter: () => multitouch.element!.center })
        : new Observable();
}
