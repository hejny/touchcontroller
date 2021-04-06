import { forTime } from 'waitasecond';
import { Vector } from 'xyzt';
import { Touch } from '../touch/Touch';
import { TouchController } from '../touch/TouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { IEmulateTouchOptions } from './IEmulateTouchOptions';
import { _getEmulateTouchAdvancedOptions } from './_getEmulateTouchAdvancedOptions';

export function emulateTouch(touchController: TouchController, options: IEmulateTouchOptions): Promise<Touch> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        const { frames } = _getEmulateTouchAdvancedOptions(options);
        let touch: null | Touch = null;

        for (const frame of frames) {
            await forTime(250);

            const touchFrame = new TouchFrame({
                element: touchController.anchorElement,
                anchorElement: touchController.anchorElement,
                positionRelative: Vector.fromObject(frame.position),
            });

            if (!touch) {
                touch = new Touch({
                    type: 'TOUCH',
                    anchorElement: touchController.anchorElement,
                    firstFrame: touchFrame,
                });
                touchController.touches.next(touch);
                resolve(touch);
            } else {
                touch.frames.next(touchFrame);
            }
        }
    });
}
