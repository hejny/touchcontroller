import { forImmediate, forTime } from 'waitasecond';
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

export async function emulateTouch(options: IEmulateTouchRequired&Partial<IEmulateTouchOptions>): Promise<void>{

    await forTime(250);

    const {touchController, position} = {
        ...defaults,
        ...options,
    };

    const touch = new Touch('TOUCH',touchController.anchorElement);
    touchController.emulateTouch(touch);

    await forTime(250);

    touch.frames.next(new TouchFrame(
        touchController.anchorElement,
        touchController.anchorElement,
        Vector.fromObject(position),
    ));


}