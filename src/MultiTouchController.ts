import { Observable } from 'rxjs/Observable';
import {Observer} from "rxjs/Observer";
import TouchController from './TouchController';
import MultiTouch from './MultiTouch';
import Vector2 from './Vector2';


export default class MultiTouchController<TElement>{

    public multiTouches: Observable<MultiTouch>;
    private _multiTouchesObserver: Observer<MultiTouch>;
    private _ongoingMultiTouchesWithElements: { element: TElement; multiTouch: MultiTouch; }[] = [];

    constructor(private _touchController: TouchController,
                private _elementBinder: (position: Vector2) => TElement) {

        this.multiTouches = Observable.create((observer:Observer<MultiTouch>)=>{
            this._multiTouchesObserver = observer;
        });

        this._touchController.touches.subscribe((touch) => {

            const element = this._elementBinder(touch.firstPosition);
            //todo why can not be used find
            let multiTouchWithElement = this._ongoingMultiTouchesWithElements.filter((multiTouchWithElement)=>multiTouchWithElement.element===element)[0];

            if(typeof multiTouchWithElement==='undefined'){

                console.log('creating new multitouch');
                multiTouchWithElement = {element,multiTouch: new MultiTouch(touch)};
                this._ongoingMultiTouchesWithElements.push(multiTouchWithElement);
            }else{
                multiTouchWithElement.multiTouch.addTouch(touch);
            }

            this._multiTouchesObserver.next(multiTouchWithElement.multiTouch);

            //todo close when all _multiTouchesObserver closed

        });
    }


}
