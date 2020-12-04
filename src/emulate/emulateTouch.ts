import { forTime } from 'waitasecond';
import { Vector } from 'xyzt';

import { Touch } from '../touch/Touch';
import { TouchController } from '../touch/TouchController';
import { TouchFrame } from '../touch/TouchFrame';
import { IEmulateTouchOptions } from './IEmulateTouchOptions';
import { _getEmulateTouchAdvancedOptions } from './_getEmulateTouchAdvancedOptions';

export async function emulateTouch(touchController: TouchController,options: IEmulateTouchOptions): Promise<void>{

    const {frames} = _getEmulateTouchAdvancedOptions(options);


    await forTime(250);

    const touch = new Touch('TOUCH',touchController.anchorElement);
    touchController.touches.next(touch);

    for(const frame of frames){
        await forTime(250);
        touch.frames.next(new TouchFrame(
            touchController.anchorElement,
            touchController.anchorElement,
            Vector.fromObject(frame.position),
        ));
    }

  


}