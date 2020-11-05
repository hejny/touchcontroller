import { IVector, Vector } from 'xyzt';

import { GridTouchController } from './GridTouchController';
import { ITouchController } from './interfaces/ITouchController';
import { Touch } from './Touch';
import { TouchFrame } from './TouchFrame';

/**
 * TODO:Maybe different name like coordination system
 */
export class Grid {
    constructor(private positionToGridPosition: (vector: IVector) => IVector) {}

    public applyToTouchController(
        touchController: ITouchController,
    ): GridTouchController {
        return new GridTouchController(touchController, this);
    }

    public applyToTouch(touch: Touch): Touch {
        // TODO: Maybe there should be some Touch.clone()

        let lastGridFrame = this.applyToTouchFrame(touch.firstFrame);
        const gridTouch = new Touch(
            touch.type,
            touch.anchorElement,
            lastGridFrame,
            touch.buttonIdentifier,
        );

        // TODO: How to discard this subscription?
        touch.frames.subscribe(
            (frame) => {
                const gridFrame = this.applyToTouchFrame(frame);

                if (
                    Vector.isEqual(gridFrame.position, lastGridFrame.position)
                ) {
                    return;
                }

                lastGridFrame = gridFrame;
                gridTouch.move(gridFrame);
            },
            () => {
                /**/
            },
            () => {
                gridTouch.end();
            },
        );

        return gridTouch;
    }

    public applyToTouchFrame(touchFrame: TouchFrame): TouchFrame {
        // TODO: Do not recount position, offset, positionRelative in construnctor of TouchFrame
        const gridTouchFrame = touchFrame.clone();
        gridTouchFrame.position = Vector.fromObject(
            this.positionToGridPosition(touchFrame.position),
        );
        return gridTouchFrame;
    }
}
