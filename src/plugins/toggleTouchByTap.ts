import { Touch } from '../main';
import { TouchController } from '../TouchController';

// TODO: Maybe as plugin in touchController.installPlugin
// TODO: Tresholds to params
// TODO: Discart initial and stopping touches
export function toggleTouchByTap(touchController: TouchController) {
    let virtualTouch: Touch | null = null;

    touchController.touches.subscribe((touch) => {
        touch.frames.subscribe(
            () => undefined,
            () => undefined,
            () => {
                if (
                    touch.firstFrame.position
                        .subtract(touch.lastFrame.position)
                        .length() < 10 &&
                    touch.lastFrame.time - touch.firstFrame.time < 500
                ) {
                    if (!virtualTouch) {
                        virtualTouch = new Touch(
                            'MOUSE',
                            touch.anchorElement,
                            touch.firstFrame,
                        );
                        touchController.emulateTouch(virtualTouch);
                        // console.info('Starting virtual touch', virtualTouch);
                    } else {
                        virtualTouch.end();
                        virtualTouch = null;
                        // console.info('Stopping virtual touch');
                    }
                }
            },
        );
    });

    touchController.hoveredFrames.subscribe((frame) => {
        // console.log(frame);
        if (virtualTouch) {
            virtualTouch.move(frame);
            // console.info('Moving virtual touch', frame);
        }
    });
}
