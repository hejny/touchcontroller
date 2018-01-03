import {Observable} from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import {Subscription} from "rxjs/Subscription";
import Touch from './Touch';
import MultiTouch from './MultiTouch';
import Transformation from './Transformation';
import Vector2 from './Vector2';


export default function multiTouchTransformations<TElement>(multiTouch: MultiTouch<TElement>, objectTransformation: Transformation = Transformation.Zero()): Observable<Transformation> {
    return Observable.create((observer: Observer<Transformation>) => {

        //objectTransformation = objectTransformation.clone();

        let subscriptions: Subscription[] = [];

        multiTouch.ongoingTouchesChanges.subscribe(
            (touches) => {


                for (const subscription of subscriptions) {
                    subscription.unsubscribe();
                }
                //todo maybe subscription = [];

                /*for(const touch of touches){
                 touch.chop();
                 }*/

                let countTouchesTransformation: (...touches: Touch[]) => Transformation;

                //console.log(touches);
                if (touches.length === 1) {

                    /*
                     const touch = touches[0];
                     subscriptions = [touch.frames.subscribe((position)=>{
                     //console.log( position.subtract(touch.firstFrame));
                     observer.next(
                     //todo optimize
                     objectTransformation.add(new Transformation(
                     position.subtract(touch.firstFrame),
                     0,
                     1
                     ))
                     );
                     })];*/
                    countTouchesTransformation = (touch1) =>
                        new Transformation(
                            touch1.lastFrame.position,
                            0,
                            1
                        );


                } else {
                    //todo how to figure out with 3, 4, 5,... finger on one object?
                    countTouchesTransformation = (...touches) =>
                        new Transformation(
                            Vector2.Zero().add(...touches.map((touch) => touch.lastFrame.position)).scale(1 / touches.length),
                            touches[0].lastFrame.position.rotation(touches[1].lastFrame.position),
                            touches[0].lastFrame.position.length(touches[1].lastFrame.position)
                        );
                }

                let lastTouchesTransformation = countTouchesTransformation(...touches);


                const touchMoveCallback = () => {

                    const currentTouchesTransformation = countTouchesTransformation(...touches);

                    objectTransformation = objectTransformation.add(
                        currentTouchesTransformation.subtract(lastTouchesTransformation)
                    );
                    observer.next(objectTransformation);

                    lastTouchesTransformation = currentTouchesTransformation;


                };

                subscriptions = touches.map((touch) => touch.frames.subscribe(touchMoveCallback));
                /*subscriptions = [
                 touch1.frames.subscribe(touchMoveCallback),
                 touch2.frames.subscribe(touchMoveCallback)
                 ];*/


            },
            () => {
            },
            () => {
                observer.complete();
            }
        );
    });
}