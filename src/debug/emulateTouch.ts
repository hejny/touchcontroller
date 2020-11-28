import { IVector, Vector } from 'xyzt';
import { Touch } from '../touch/Touch';
import { TouchController } from '../touch/TouchController';
import { TouchFrame } from '../touch/TouchFrame';

interface IEmulateTouchRequired{
    touchController: TouchController;
}

interface IEmulateTouchOptions{
    // TODO: type
    position: IVector;
}

const defaults: IEmulateTouchOptions = {
    position: Vector.zero()
};

export function emulateTouch(options: IEmulateTouchRequired&Partial<IEmulateTouchOptions>): void{

    const {touchController, position} = {
        ...defaults,
        ...options,
    };

    console.log({position});

    const touch = new Touch('TOUCH',touchController.anchorElement);
    touchController.emulateTouch(touch);

    touch.frames.next(new TouchFrame(
        touchController.anchorElement,
        touchController.anchorElement,
        Vector.fromObject(position),
    ));


}