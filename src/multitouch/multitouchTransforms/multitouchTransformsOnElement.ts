import { Observable } from 'rxjs/internal/Observable';
import { ITransformData } from 'xyzt';
import { IMultitouchTransformsOptions, multitouchTransforms } from './multitouchTransforms';

type IMultitouchTransformsOnElementOptions = Omit<IMultitouchTransformsOptions, 'getElementCenter'>;

export function multitouchTransformsOnElement(options: IMultitouchTransformsOnElementOptions): Observable<ITransformData> {
    return options.multitouch.element
        ? multitouchTransforms({ ...options, getElementCenter: () => options.multitouch.element!.center })
        : new Observable();
}
