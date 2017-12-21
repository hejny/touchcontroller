import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import MultiTouch from './MultiTouch';
import Transformation from './Transformation';
import Vector2 from './Vector2';


export default function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, objectTransformation: Transformation = Transformation.Zero()): Observable<Transformation> {
    return Observable.create((observer: Observer<Transformation>) => {
        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {
                if (touches.length === 2) {

                    //todo collision mismatch

                    const touch1 = touches[0];
                    const touch2 = touches[1];


                    const countTouchesTransformation = () => {
                        return new Transformation(
                            Vector2.Zero(),
                            0,
                            touch1.lastPosition.length(touch2.lastPosition)
                        );
                    };


                    let lastTouchesTransformation = countTouchesTransformation();


                    const touchMoveCallback = () => {

                        const currentTouchesTransformation = countTouchesTransformation();

                        objectTransformation = objectTransformation.add(currentTouchesTransformation.subtract(lastTouchesTransformation));
                        observer.next(objectTransformation);

                        lastTouchesTransformation = currentTouchesTransformation;


                    };


                    touch1.positions.subscribe(touchMoveCallback);
                    touch2.positions.subscribe(touchMoveCallback);


                }
            },
            () => {
            },
            () => {
                observer.complete();
            }
        );
    });
}