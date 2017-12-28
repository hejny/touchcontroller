import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import {Subscription} from "rxjs/Subscription";
import MultiTouch from './MultiTouch';
import Transformation from './Transformation';
//import Vector2 from './Vector2';


export default function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, objectTransformation: Transformation = Transformation.Zero()): Observable<Transformation> {
    return Observable.create((observer: Observer<Transformation>) => {

        objectTransformation = objectTransformation.clone();

        let subscriptions: Subscription[] = [];

        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {


                for(const subscription of subscriptions){
                    subscription.unsubscribe();
                }
                //todo maybe subscription = [];

                console.log(touches);
                if (touches.length === 1) {

                    //todo dispose after change touches
                    const touch = touches[0];
                    subscriptions = [touch.positions.subscribe((position)=>{
                        //console.log( position.subtract(touch.firstPosition));
                        observer.next(
                            //todo optimize
                            objectTransformation.add(new Transformation(
                                position.subtract(touch.firstPosition),
                                0,
                                1
                            ))
                        );
                    })];


                } else if (touches.length === 2) {

                    //todo dispose after change touches

                    const touch1 = touches[0];
                    const touch2 = touches[1];


                    console.log(touch2.lastPosition);
                    const countTouchesTransformation = () => {
                        return new Transformation(
                            touch1.lastPosition.add(touch2.lastPosition).scale(1/2),
                            touch1.lastPosition.rotation(touch2.lastPosition),
                            touch1.lastPosition.length(touch2.lastPosition)
                        );
                    };


                    let lastTouchesTransformation = countTouchesTransformation();


                    const touchMoveCallback = () => {

                        const currentTouchesTransformation = countTouchesTransformation();

                        objectTransformation = objectTransformation.add(
                            currentTouchesTransformation.subtract(lastTouchesTransformation)
                        );
                        observer.next(objectTransformation);

                        lastTouchesTransformation = currentTouchesTransformation;


                    };


                    subscriptions = [
                        touch1.positions.subscribe(touchMoveCallback),
                        touch2.positions.subscribe(touchMoveCallback)
                    ];


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