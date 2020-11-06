import { ITransform, Transform, Vector } from 'xyzt';
import { IBoundingBox } from './IBoundingBox';

export class BoundingBox implements IBoundingBox {
    public static neutral(): BoundingBox {
        return new BoundingBox(Transform.neutral());
    }

    public static fromTransform(transform: ITransform): BoundingBox {
        return new BoundingBox(Transform.fromObject(transform));
    }

    protected constructor(public transform: Transform) {}

    public get center(): Vector {
        return this.transform.translate;
    }

    // TODO: Other corners

    public get size(): Vector {
        return this.transform.scale;
    }

    public get rotation(): Vector {
        return this.transform.rotate;
    }

    // TODO: setters

    public applyTransform(transform: ITransform) {
        this.transform = Transform.combine(this.transform, transform);
    }
}
