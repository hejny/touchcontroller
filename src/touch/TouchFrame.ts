import { Vector } from 'xyzt';
import { IElement } from '../interfaces/IElement';
import { getBoundingClientRectEnhanced } from '../utils/getBoundingClientRectEnhanced';

export class TouchFrame {
    public position: Vector;

    constructor(
        // TODO: make it as options
        public readonly element: IElement,
        public readonly anchorElement: IElement,
        public readonly positionRelative: Vector = Vector.zero(),
        public readonly time: number = performance.now(),
        public readonly rotating: boolean = false,
        public readonly force: number = 0,
        public readonly radius: Vector = Vector.zero(),
        countPosition = true,
    ) {
        if (countPosition) {
            const offset = Vector.fromObject(
                getBoundingClientRectEnhanced(element),
                ['x', 'y'],
            ).subtract(
                Vector.fromObject(
                    getBoundingClientRectEnhanced(anchorElement),
                    ['x', 'y'],
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
