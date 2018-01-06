import IListener from './IListener';
import createMouseListener from './createMouseListener';
import Touch from '../Touch';
import TouchFrame from '../TouchFrame';
TouchFrame;

export default function(buttons:number[] = [1,2]):IListener{


    const listener = createMouseListener(buttons);



    return (element: HTMLElement,
            newTouch: (touch: Touch) => void
    ) => {


        //const disposeOrignalListener = listener(element,newTouch);
        const disposeOrignalListener = listener(element,(touchOriginal: Touch) => {

            const touchScale = new Touch(
                'MOUSE',
                touchOriginal.firstFrame
            );


            touchOriginal.frames.subscribe((frame)=>{

                touchScale.move(new TouchFrame(
                    touchOriginal.firstFrame.position,
                    touchOriginal.lastFrame.time,
                    touchOriginal.lastFrame.position.rotation(touchOriginal.firstFrame.position)
                ));

            },()=>{


            },()=>{
                touchScale.end();
            });


            newTouch(touchScale);

        });


        return ()=>{
            //todo dispose self
            disposeOrignalListener();
        }
    }
}