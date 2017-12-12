/*import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Vector2 from './Vector2';


export default class MultiTouchController{

    public observable: Observable<MultiTouch>;
    public _observer: Observer<MultiTouch>;
    private _ongoingMultiTouches: { element: TElement; multiTouch: MultiTouch; }[] = [];

    constructor(private _touchController: TouchController,
                private _elementBinder: (position: Vector2) => TElement) {

        this.observable = Observable.create((observer:Observer<MultiTouch>)=>{
            this._observer = observer;
        });

        this._touchController.subscribe('START', (touch) => {


            const element = this._elementBinder(touch.firstPosition);
            //todo why can not be used find
            let multiTouch = this._ongoingMultiTouches.filter((multiTouch)=>multiTouch.element===element)[0];

            if(typeof multiTouch==='undefined'){

                console.log('creating new multitouch');
                multiTouch = {element,multiTouch: new MultiTouch()};
                this._ongoingMultiTouches.push(multiTouch);
            }

            multiTouch.multiTouch.addTouch(touch);

            this.callSubscribers('START',multiTouch.multiTouch);

        });
    }


}
*/