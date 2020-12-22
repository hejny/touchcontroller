import { forTime } from 'waitasecond';
import { Vector } from 'xyzt';
import { Touch } from '../touch/Touch';
import { TouchController } from '../touch/TouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { IEmulateTouchOptions } from './IEmulateTouchOptions';
import { _getEmulateTouchAdvancedOptions } from './_getEmulateTouchAdvancedOptions';

export async function emulateTouch(touchController: TouchController, options: IEmulateTouchOptions): Promise<Touch> {
    // TODO: Maybe not async
    const { frames } = _getEmulateTouchAdvancedOptions(options);

    // await forTime(250);

    const touch = new Touch({
        type: 'TOUCH',
        anchorElement: touchController.anchorElement,
    });
    touchController.touches.next(touch);

    for (const frame of frames) {
        await forTime(250);
        touch.frames.next(
            new TouchFrame({
                element: touchController.anchorElement,
                anchorElement: touchController.anchorElement,
                positionRelative: Vector.fromObject(frame.position),
            }),
        );
    }

    return touch;
}
