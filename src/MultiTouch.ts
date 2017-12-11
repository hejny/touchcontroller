import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import Touch from './Touch';

export default class MultiTouch extends AbstractClassWithSubscribe<"MOVE" | "END", Touch> {

    public touches: Touch[] = [];

    /*constructor() {
        super();
    }*/

    addTouch(touch:Touch){
        this.touches.push(touch);

        touch.subscribe('MOVE',()=>{
            this.callSubscribers('MOVE',touch);
        });

        touch.subscribe('END',()=>{
            this.callSubscribers('END',touch);
        });

        //todo END all

    }

}