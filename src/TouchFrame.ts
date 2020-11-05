import { Vector } from 'xyzt';

import { IElement } from './interfaces/IElement';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';

export class TouchFrame {
    public position: Vector;

    constructor(
        public element: IElement,
        public anchorElement: IElement,
        public positionRelative: Vector = Vector.zero(),
        public time: number = performance.now(),
        public rotating: boolean = false,
        public force: number = 0,
        public radius: Vector = Vector.zero(),
        countPosition = true,
    ) {
        if (countPosition) {
            const offset = Vector.fromTopLeft(
                getBoundingClientRectEnhanced(element),
            ).subtractInPlace(
                Vector.fromTopLeft(
                    getBoundingClientRectEnhanced(anchorElement),
                ),
            );
            this.position = this.positionRelative.add(offset);
        }
    }

    public clone(): TouchFrame {
        const touchFrame = new TouchFrame(
            this.element,
            this.anchorElement,
            this.positionRelative,
            this.time,
            this.rotating,
            this.force,
            this.radius,
            false,
        );
        touchFrame.position = this.position;
        return touchFrame;
    }
}

/**
 * TODO: Maybe? TC first frame and frames access in every touch frame
 */
