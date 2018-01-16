import IListener from './IListener';
import createMouseListener from './createMouseListener';
import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
import Vector2 from "../Vector2";
import {isNull} from "util";
TouchFrame;

export default function(buttons:number[] = [1,2]):IListener{


    const listener = createMouseListener(buttons);



    return (element: HTMLElement,
            newTouch: (touch: Touch) => void,
            newHoverFrame: (frame: TouchFrame)=>void
    ) => {


        //const disposeOrignalListener = listener(element,newTouch);
        const disposeOrignalListener = listener(element,(touchOriginal: Touch) => {

            const touchScale = new Touch(
                'MOUSE',
                touchOriginal.firstFrame
            );

            let initialPoint: Vector2|null = null;

            touchOriginal.frames.subscribe((frame)=>{







                if(!isNull(initialPoint)){
                    touchScale.move(new TouchFrame(
                        touchOriginal.firstFrame.position,
                        touchOriginal.lastFrame.time,
                        touchOriginal.lastFrame.position.rotation(touchOriginal.firstFrame.position)
                        - initialPoint.rotation(touchOriginal.firstFrame.position),
                        1
                        /*touchOriginal.lastFrame.position.length(touchOriginal.firstFrame.position)
                        / initialPoint.length(touchOriginal.firstFrame.position)*/
                    ));
                }else{


                    if(touchOriginal.lastFrame.position.length(touchOriginal.firstFrame.position)>=10/*todo to config*/){
                        initialPoint = touchOriginal.lastFrame.position;
                    }


                }


            },()=>{


            },()=>{
                touchScale.end();
            });


            newTouch(touchScale);

        },newHoverFrame);


        return ()=>{
            //todo dispose self
            disposeOrignalListener();
        }
    }
}