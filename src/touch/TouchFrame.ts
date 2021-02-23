import { ICoorsys, Point, Vector } from 'xyzt';
import { IElement } from '../interfaces/IElement';
import { getBoundingClientRectEnhanced } from '../utils/getBoundingClientRectEnhanced';
import { WithOptional } from '../utils/WithOptional';

interface ITouchFrameOptions {
    element: IElement;
    anchorElement: IElement;
    corsys: ICoorsys;
    positionRelative: Vector;
    time: number | null;
    rotating: boolean;
    force: number;
    radius: Vector;
    countPosition: boolean;
}

const touchFrameOptionsDefault = {
    positionRelative: Vector.zero(),
    time: null,
    rotating: false,
    force: 0,
    radius: Vector.zero(),
    countPosition: true,
};

export class TouchFrame {
    public readonly element: IElement;
    public readonly anchorElement: IElement;
    public readonly corsys: ICoorsys;
    public readonly positionRelative: Vector;
    public readonly time: number | null;
    public readonly rotating: boolean;
    public readonly force: number;
    public readonly radius: Vector;
    public point: Point;

    constructor(options: WithOptional<ITouchFrameOptions, keyof typeof touchFrameOptionsDefault>) {
        const { element, anchorElement, positionRelative, corsys, time, rotating, force, radius, countPosition } = {
            ...touchFrameOptionsDefault,
            time: performance.now(),
            ...options,
        };

        this.element = element;
        this.anchorElement = anchorElement;
        this.corsys = corsys;
        this.positionRelative = positionRelative;
        this.time = time;
        this.rotating = rotating;
        this.force = force;
        this.radius = radius;

        if (countPosition) {
            const offset = Vector.fromObject(getBoundingClientRectEnhanced(element), ['x', 'y']).subtract(
                Vector.fromObject(getBoundingClientRectEnhanced(anchorElement), ['x', 'y']),
            );
            this.point = new Point(corsys, this.positionRelative.add(offset));
        }
    }

    public clone(): TouchFrame {
        const touchFrame = new TouchFrame({ ...this, countPosition: false /* TODO: Why? */ });
        touchFrame.point = this.point;
        return touchFrame;
    }
}

/**
 * TODO: Maybe? TC first frame and frames access in every touch frame
 */
