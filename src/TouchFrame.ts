import { IElement } from './interfaces/IElement';
import { Vector2 } from './Vector2';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';

export class TouchFrame {
    public position: Vector2;

    constructor(
        public element: IElement,
        public anchorElement: IElement,
        public positionRelative: Vector2 = Vector2.Zero(),
        public time: number = performance.now(),
        public rotating: boolean = false,
        public force: number = 0,
        public radius: Vector2 = Vector2.Zero(),
    ) {
        const offset = Vector2.fromTopLeft(
            getBoundingClientRectEnhanced(element),
        ).subtractInPlace(
            Vector2.fromTopLeft(getBoundingClientRectEnhanced(anchorElement)),
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
