import { IElement } from './interfaces/IElement';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';
import { Vector } from 'xyzt';


export class TouchFrame {
    public position: Vector;

    constructor(
        public element: IElement,
        public anchorElement: IElement,
        public positionRelative: Vector = Vector.Zero(),
        public time: number = performance.now(),
        public rotating: boolean = false,
        public force: number = 0,
        public radius: Vector = Vector.Zero(),
    ) {
        const offset = Vector.fromTopLeft(
            getBoundingClientRectEnhanced(element),
        ).subtractInPlace(
            Vector.fromTopLeft(getBoundingClientRectEnhanced(anchorElement)),
        );
        this.position = this.positionRelative.add(offset);
    }

    public clone(): TouchFrame {
        return new TouchFrame(
            this.element,
            this.anchorElement,
            this.positionRelative,
            this.time,
            this.rotating,
            this.force,
            this.radius,
        );
    }
}
