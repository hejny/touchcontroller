import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Touch from './Touch';

export default class MultiTouchController<TElement> extends AbstractClassWithSubscribe<"START", MultiTouch> {

    private _multiTouches: { element: TElement; multiTouch: MultiTouch; }[] = [];

    constructor(private _touchController: TouchController,
                private _elementBinder: (touch: Touch) => TElement) {
        super();
        this._touchController.subscribe('START', (touch) => {


            const element = this._elementBinder(touch);
            //todo why can not be used find
            let multiTouch = this._multiTouches.filter((multiTouch)=>multiTouch.element===element)[0];

            if(typeof multiTouch==='undefined'){
                multiTouch = {element,multiTouch: new MultiTouch()};
                this._multiTouches.push(multiTouch);
            }

            multiTouch.multiTouch.addTouch(touch);

            this.callSubscribers('START',multiTouch.multiTouch);

        });
    }


}
